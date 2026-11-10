import { Producto } from '../cart/Producto.js'

// Se conserva el catálogo original hasta que se cargue la colección de Firestore.
// Los documentos persistidos sustituyen a los predefinidos; las bajas no reaparecen.
export function combinarCatalogos(base, documentos) {
  const activos = { ...base }
  const archivados = []
  for (const documento of documentos) {
    if (!documento || typeof documento.sku !== 'string') continue
    const original = base[documento.sku]
    const imagen = documento.imagenUrl || original?.imagen || ''
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
      // Documentos ajenos al esquema no se publican en el catálogo.
    }
  }
  return { productos: activos, archivados }
}

export function validarFormularioProducto(datos, esNuevo, esModeloBase = false) {
  const nombre = String(datos.nombre || '').trim()
  const modelo = String(datos.modelo || '').trim()
  const descripcion = String(datos.descripcion || '').trim()
  const imagenUrl = String(datos.imagenUrl || '').trim()
  const precio = Number(datos.precio)
  if (nombre.length < 3 || nombre.length > 100) throw new Error('El nombre debe tener de 3 a 100 caracteres.')
  if (modelo.length < 2 || modelo.length > 60) throw new Error('El modelo debe tener de 2 a 60 caracteres.')
  if (!Number.isSafeInteger(precio) || precio < 1 || precio > 999999999)
    throw new Error('Ingresá un precio entero mayor a cero.')
  if (descripcion.length > 600) throw new Error('La descripción no debe superar los 600 caracteres.')
  if (imagenUrl.length > 2048 || (imagenUrl && !/^https:\/\/[^\s]+$/i.test(imagenUrl)))
    throw new Error('Usá una URL de imagen HTTPS válida.')
  if (!esModeloBase && !imagenUrl)
    throw new Error(esNuevo ? 'Para un producto nuevo es necesaria una imagen HTTPS.' : 'Conservá una imagen HTTPS para este producto.')
  return { nombre, modelo, descripcion, precio, imagenUrl }
}
