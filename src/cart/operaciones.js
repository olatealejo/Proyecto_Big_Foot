// Funciones puras para validar, sumar y modificar líneas del carrito.
export const MAX_CANTIDAD = 99 // Límite técnico por línea; no equivale a stock.

function validarLinea(dato,productos){
  if(!dato||typeof dato!=="object")return null;
  const producto=productos[dato.sku];
  const talle=Number(dato.talle),cantidad=Number(dato.cantidad);
  if(!producto||!producto.permiteTalle(talle)||!Number.isSafeInteger(cantidad)||cantidad<1)return null;
  return {sku:producto.sku,talle,cantidad:Math.min(MAX_CANTIDAD,cantidad)};
}

export function normalizarCarrito(datos,productos){
  if(!Array.isArray(datos))return [];
  const mapa=new Map();
  for(const dato of datos){
    const linea=validarLinea(dato,productos);
    if(!linea)continue;
    const clave=linea.sku+":"+linea.talle;
    const anterior=mapa.get(clave)?.cantidad||0;
    mapa.set(clave,{...linea,cantidad:Math.min(MAX_CANTIDAD,anterior+linea.cantidad)});
  }
  return [...mapa.values()];
}

export function agregarLinea(datos,sku,talle,productos){
  const producto=productos[sku], numero=Number(talle);
  if(!producto||!producto.permiteTalle(numero))return datos;
  return normalizarCarrito([...datos,{sku,talle:numero,cantidad:1}],productos);
}

export function cambiarCantidadLinea(datos,sku,talle,cantidad,productos){
  const producto=productos[sku], numero=Number(talle);
  if(!producto||!producto.permiteTalle(numero)||!Number.isSafeInteger(cantidad))return datos;
  if(cantidad<=0)return quitarLinea(datos,sku,numero);
  return datos.map(linea=>linea.sku===sku&&linea.talle===numero?{...linea,cantidad:Math.min(MAX_CANTIDAD,cantidad)}:linea);
}

export function quitarLinea(datos,sku,talle){
  const numero=Number(talle);
  return datos.filter(linea=>!(linea.sku===sku&&linea.talle===numero));
}

export function calcularResumen(datos,productos){
  return normalizarCarrito(datos,productos).reduce((acum,linea)=>{
    acum.cantidadTotal+=linea.cantidad;
    acum.subtotal+=productos[linea.sku].calcularImporte(linea.cantidad);
    return acum;
  },{cantidadTotal:0,subtotal:0});
}
