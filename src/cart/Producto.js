export const TALLES = Object.freeze([38, 39, 40, 41, 42, 43, 44, 45])

export class Producto{
  constructor({sku,nombre,modelo,precio,imagen,ruta}){
    if(!sku||!nombre||!modelo||!ruta||!Number.isSafeInteger(precio)||precio<=0)throw new Error("Datos de producto inválidos");
    this.sku=sku;this.nombre=nombre;this.modelo=modelo;this.precio=precio;this.imagen=imagen;this.ruta=ruta;
  }
  permiteTalle(talle){return Number.isInteger(Number(talle))&&TALLES.includes(Number(talle))}
  calcularImporte(cantidad){return Number.isSafeInteger(cantidad)&&cantidad>0?this.precio*cantidad:0}
}
