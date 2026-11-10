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

export class Producto {
  constructor({
    sku,
    nombre,
    modelo,
    precio,
    imagen,
    ruta,
    descripcion = '',
    imagenUrl = '',
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
    this.descripcion = descripcion
    this.imagenUrl = imagenUrl
    this.activo = activo
    this.motivoBaja = motivoBaja
  }

  permiteTalle(talle) {
    const talleNumerico = Number(talle)

    return (
      Number.isInteger(talleNumerico)
      && TALLES.includes(talleNumerico)
    )
  }

  calcularImporte(cantidad) {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
      return 0
    }

    return this.precio * cantidad
  }
}
