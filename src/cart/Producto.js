export const TALLES = Object.freeze([
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
])

function normalizarImagenes(imagenes, imagenPrincipal) {
  const galeria = Array.isArray(imagenes)
    ? imagenes
        .map((imagen, indice) => ({
          src: String(
            imagen?.url || imagen?.src || '',
          ).trim(),
          nombre:
            String(imagen?.nombre || '').trim()
            || 'Vista ' + (indice + 1),
          storagePath:
            String(imagen?.storagePath || '').trim(),
        }))
        .filter((imagen) => imagen.src)
    : []

  if (galeria.length > 0) {
    return galeria
  }

  return imagenPrincipal
    ? [{
        src: imagenPrincipal,
        nombre: 'Vista principal',
        storagePath: '',
      }]
    : []
}

function normalizarTalles(talles) {
  const disponibles = Array.isArray(talles)
    ? talles
        .map(Number)
        .filter((talle) => TALLES.includes(talle))
    : []

  return disponibles.length > 0
    ? [...new Set(disponibles)].sort((a, b) => a - b)
    : [...TALLES]
}

export class Producto {
  constructor({
    sku,
    nombre,
    modelo,
    precio,
    imagen,
    ruta,
    categoria = '',
    subtitulo = '',
    descripcion = '',
    descripcionCompleta = '',
    imagenUrl = '',
    imagenes = [],
    talles = TALLES,
    activo = true,
    motivoBaja = '',
  }) {
    const datosValidos =
      sku
      && nombre
      && modelo
      && ruta
      && Number.isSafeInteger(precio)
      && precio > 0

    if (!datosValidos) {
      throw new Error('Datos de producto inválidos')
    }

    this.sku = sku
    this.nombre = nombre
    this.modelo = modelo
    this.precio = precio
    this.imagen = imagen
    this.ruta = ruta
    this.categoria = categoria || 'Zapatillas / ' + modelo
    this.subtitulo = subtitulo
    this.descripcion = descripcion
    this.descripcionCompleta =
      descripcionCompleta || descripcion
    this.imagenUrl = imagenUrl
    this.imagenes = normalizarImagenes(
      imagenes,
      imagen,
    )
    this.talles = normalizarTalles(talles)
    this.activo = activo
    this.motivoBaja = motivoBaja
  }

  permiteTalle(talle) {
    const talleNumerico = Number(talle)

    return (
      Number.isInteger(talleNumerico)
      && this.talles.includes(talleNumerico)
    )
  }

  calcularImporte(cantidad) {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
      return 0
    }

    return this.precio * cantidad
  }
}
