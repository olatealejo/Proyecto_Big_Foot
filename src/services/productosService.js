import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'

import { PRODUCTOS } from '../cart/catalogo'
import { validarFormularioProducto } from '../catalogo/productosLogica'
import { db, storage } from './firebase'

const TIPOS_IMAGEN = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])
const TAMANO_MAXIMO = 5 * 1024 * 1024

function verificarAcceso(esAdmin, usuario) {
  if (!db || !storage) {
    throw new Error(
      'Firebase no está configurado para administrar productos.',
    )
  }

  if (!esAdmin || !usuario?.uid) {
    throw new Error(
      'No tenés permisos para administrar productos.',
    )
  }
}

function validarArchivo(archivo) {
  if (!TIPOS_IMAGEN.has(archivo.type)) {
    throw new Error(
      'Las imágenes deben ser JPG, PNG o WEBP.',
    )
  }

  if (archivo.size > TAMANO_MAXIMO) {
    throw new Error(
      'Cada imagen debe pesar como máximo 5 MB.',
    )
  }
}

function nombreSeguro(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .toLowerCase()
}

async function subirImagen({
  imagen,
  sku,
  usuario,
  indice,
}) {
  validarArchivo(imagen.archivo)

  const identificador =
    globalThis.crypto?.randomUUID?.()
    || Date.now() + '-' + indice
  const ruta =
    'productos/'
    + sku
    + '/'
    + identificador
    + '-'
    + nombreSeguro(imagen.archivo.name)

  const referencia = ref(storage, ruta)

  await uploadBytes(
    referencia,
    imagen.archivo,
    {
      contentType: imagen.archivo.type,
      customMetadata: {
        subidoPor: usuario.uid,
      },
    },
  )

  return {
    url: await getDownloadURL(referencia),
    nombre: String(imagen.nombre || '').trim()
      || 'Vista ' + (indice + 1),
    storagePath: ruta,
  }
}

async function borrarImagenes(rutas) {
  await Promise.allSettled(
    rutas
      .filter(Boolean)
      .map((ruta) => deleteObject(ref(storage, ruta))),
  )
}

function prepararValidacion(datos) {
  return {
    ...datos,
    imagenes: datos.imagenes.map((imagen, indice) => ({
      url:
        imagen.url
        || 'https://carga-local.invalid/imagen-' + indice,
      nombre: imagen.nombre,
    })),
  }
}

export async function guardarProducto({
  datos,
  productoActual,
  usuario,
  esAdmin,
}) {
  verificarAcceso(esAdmin, usuario)

  const esNuevo = !productoActual
  const sku =
    productoActual?.sku
    || doc(collection(db, 'productos')).id
  const esModeloBase = Boolean(PRODUCTOS[sku])

  validarFormularioProducto(
    prepararValidacion(datos),
    esNuevo,
    esModeloBase,
  )

  const rutasNuevas = []

  try {
    const imagenes = await Promise.all(
      datos.imagenes.map(async (imagen, indice) => {
        if (!imagen.archivo) {
          return {
            url: imagen.url,
            nombre: imagen.nombre,
            storagePath: imagen.storagePath || '',
          }
        }

        const subida = await subirImagen({
          imagen,
          sku,
          usuario,
          indice,
        })

        rutasNuevas.push(subida.storagePath)
        return subida
      }),
    )

    const camposValidados = validarFormularioProducto(
      {
        ...datos,
        imagenes,
      },
      esNuevo,
      esModeloBase,
    )

    const imagenesFinales =
      camposValidados.imagenes.map((imagen, indice) => ({
        ...imagen,
        storagePath: imagenes[indice]?.storagePath || '',
      }))

    await setDoc(
      doc(db, 'productos', sku),
      {
        ...camposValidados,
        imagenes: imagenesFinales,
        imagenUrl: imagenesFinales[0]?.url || '',
        sku,
        activo: true,
        motivoBaja: '',
        modificadoPor: usuario.uid,
        fechaActualizacion: serverTimestamp(),
        ...(esNuevo
          ? { fechaCreacion: serverTimestamp() }
          : {}),
      },
      { merge: true },
    )

    const rutasConservadas = new Set(
      imagenesFinales
        .map((imagen) => imagen.storagePath)
        .filter(Boolean),
    )
    const rutasEliminadas =
      (productoActual?.imagenes || [])
        .map((imagen) => imagen.storagePath)
        .filter(
          (ruta) => ruta && !rutasConservadas.has(ruta),
        )

    await borrarImagenes(rutasEliminadas)

    return sku
  } catch (error) {
    await borrarImagenes(rutasNuevas)
    throw error
  }
}

export async function cambiarEstadoProducto({
  producto,
  activo,
  motivo,
  usuario,
  esAdmin,
}) {
  verificarAcceso(esAdmin, usuario)

  if (!producto?.sku) {
    throw new Error('Producto no encontrado.')
  }

  const motivoBaja = activo
    ? ''
    : String(motivo || '').trim()

  if (!activo && motivoBaja.length < 10) {
    throw new Error(
      'Escribí al menos 10 caracteres explicando la baja.',
    )
  }

  await setDoc(
    doc(db, 'productos', producto.sku),
    {
      sku: producto.sku,
      nombre: producto.nombre,
      modelo: producto.modelo,
      categoria: producto.categoria,
      subtitulo: producto.subtitulo,
      descripcion: producto.descripcion,
      descripcionCompleta: producto.descripcionCompleta,
      precio: producto.precio,
      imagenUrl: producto.imagenUrl || '',
      imagenes: producto.imagenUrl
        ? producto.imagenes.map((imagen) => ({
            url: imagen.src,
            nombre: imagen.nombre,
            storagePath: imagen.storagePath || '',
          }))
        : [],
      talles: producto.talles,
      activo,
      motivoBaja,
      modificadoPor: usuario.uid,
      fechaActualizacion: serverTimestamp(),
    },
    { merge: true },
  )
}
