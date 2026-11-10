import {
  Producto,
  TALLES,
} from '../cart/Producto.js'

export function combinarCatalogos(base, documentos) {
  const activos = { ...base }
  const archivados = []

  for (const documento of documentos) {
    if (!documento || typeof documento.sku !== 'string') {
      continue
    }

    const original = base[documento.sku]
    const imagen =
      documento.imagenUrl
      || documento.imagenes?.[0]?.url
      || original?.imagen
      || ''
    const datos = {
      ...original,
      ...documento,
      imagen,
      ruta: '/productos/' + documento.sku,
    }

    try {
      const producto = new Producto(datos)

      if (documento.activo === false) {
        delete activos[documento.sku]
        archivados.push(producto)
      } else {
        activos[documento.sku] = producto
      }
    } catch {
      // Los documentos que no cumplen el esquema no se publican.
    }
  }

  return {
    productos: activos,
    archivados,
  }
}

function validarTexto(valor, {
  nombre,
  minimo = 0,
  maximo,
  requerido = false,
}) {
  const texto = String(valor || '').trim()

  if (requerido && texto.length < minimo) {
    throw new Error(
      nombre + ' debe tener al menos ' + minimo + ' caracteres.',
    )
  }

  if (texto.length > maximo) {
    throw new Error(
      nombre + ' no debe superar los ' + maximo + ' caracteres.',
    )
  }

  return texto
}

function normalizarImagenes(imagenes) {
  if (!Array.isArray(imagenes)) {
    return []
  }

  const normalizadas = imagenes
    .map((imagen, indice) => {
      const url = String(imagen?.url || '').trim()
      const nombre =
        String(imagen?.nombre || '').trim()
        || 'Vista ' + (indice + 1)

      return {
        url,
        nombre,
        storagePath:
          String(imagen?.storagePath || '').trim(),
      }
    })
    .filter((imagen) => imagen.url)

  if (normalizadas.length > 6) {
    throw new Error('La galería admite hasta 6 imágenes.')
  }

  for (const imagen of normalizadas) {
    if (
      imagen.url.length > 2048
      || !/^https:\/\/[^\s]+$/i.test(imagen.url)
    ) {
      throw new Error(
        'Todas las imágenes deben usar una URL HTTPS válida.',
      )
    }

    if (imagen.nombre.length > 50) {
      throw new Error(
        'El nombre de cada vista admite hasta 50 caracteres.',
      )
    }
  }

  return normalizadas
}

function normalizarTalles(talles) {
  if (!Array.isArray(talles)) {
    return [...TALLES]
  }

  const normalizados = [...new Set(talles.map(Number))]
    .filter((talle) => TALLES.includes(talle))
    .sort((a, b) => a - b)

  if (normalizados.length === 0) {
    throw new Error('Seleccioná al menos un talle disponible.')
  }

  return normalizados
}

export function validarFormularioProducto(
  datos,
  esNuevo,
  esModeloBase = false,
) {
  const nombre = validarTexto(datos.nombre, {
    nombre: 'El nombre',
    minimo: 3,
    maximo: 100,
    requerido: true,
  })
  const modelo = validarTexto(datos.modelo, {
    nombre: 'El modelo',
    minimo: 2,
    maximo: 60,
    requerido: true,
  })
  const categoria = validarTexto(
    datos.categoria || 'Zapatillas / ' + modelo,
    {
      nombre: 'La categoría',
      minimo: 3,
      maximo: 80,
      requerido: true,
    },
  )
  const subtitulo = validarTexto(datos.subtitulo, {
    nombre: 'El subtítulo',
    maximo: 180,
  })
  const descripcion = validarTexto(datos.descripcion, {
    nombre: 'La descripción breve',
    maximo: 600,
  })
  const descripcionCompleta = validarTexto(
    datos.descripcionCompleta,
    {
      nombre: 'La descripción completa',
      maximo: 1500,
    },
  )
  const precio = Number(datos.precio)
  const imagenes = normalizarImagenes(datos.imagenes)
  const imagenUrl =
    imagenes[0]?.url
    || String(datos.imagenUrl || '').trim()
  const talles = normalizarTalles(datos.talles)

  if (
    imagenUrl
    && (
      imagenUrl.length > 2048
      || !/^https:\/\/[^\s]+$/i.test(imagenUrl)
    )
  ) {
    throw new Error('Usá una URL de imagen HTTPS válida.')
  }

  if (
    !Number.isSafeInteger(precio)
    || precio < 1
    || precio > 999999999
  ) {
    throw new Error(
      'Ingresá un precio entero mayor que cero.',
    )
  }

  if (!esModeloBase && imagenes.length === 0 && !imagenUrl) {
    throw new Error(
      esNuevo
        ? 'Agregá al menos una imagen para el producto.'
        : 'El producto debe conservar una imagen.',
    )
  }

  return {
    nombre,
    modelo,
    categoria,
    subtitulo,
    descripcion,
    descripcionCompleta,
    precio,
    imagenUrl,
    imagenes,
    talles,
  }
}
