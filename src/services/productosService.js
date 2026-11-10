import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { PRODUCTOS } from '../cart/catalogo'
import { validarFormularioProducto } from '../catalogo/productosLogica'
import { db } from './firebase'

function verificarFirebase() {
  if (!db) {
    throw new Error(
      'Firebase no está configurado para guardar productos.',
    )
  }
}

function verificarAdministrador(esAdmin, usuario) {
  if (!esAdmin || !usuario?.uid) {
    throw new Error(
      'No tenés permisos para administrar productos.',
    )
  }
}

function verificarAcceso(esAdmin, usuario) {
  verificarFirebase()
  verificarAdministrador(esAdmin, usuario)
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

  const camposValidados = validarFormularioProducto(
    datos,
    esNuevo,
    esModeloBase,
  )

  await setDoc(
    doc(db, 'productos', sku),
    {
      ...camposValidados,
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

  return sku
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

  const camposValidados = validarFormularioProducto(
    {
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
          }))
        : [],
      talles: producto.talles,
    },
    false,
    Boolean(PRODUCTOS[producto.sku]),
  )

  await setDoc(
    doc(db, 'productos', producto.sku),
    {
      ...camposValidados,
      sku: producto.sku,
      activo,
      motivoBaja,
      modificadoPor: usuario.uid,
      fechaActualizacion: serverTimestamp(),
    },
    { merge: true },
  )
}
