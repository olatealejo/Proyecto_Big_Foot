// Filtros del catálogo que se activan con los eventos de los controles.
function normalizarBusqueda(valor){return String(valor??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es").trim()}

export function filtrarProductos(productos,{texto="",modelo="todos",precioMaximo="todos",orden="destacados"}={}){
  const busqueda=normalizarBusqueda(texto);
  const tope=precioMaximo==="todos"?Infinity:Number(precioMaximo);
  const resultado=productos.filter(producto=>
    (!busqueda||normalizarBusqueda(producto.nombre).includes(busqueda))&&
    (modelo==="todos"||producto.modelo===modelo)&&
    (precioMaximo==="todos"||(Number.isFinite(tope)&&producto.precio<=tope))
  );
  if(orden==="precio-asc")resultado.sort((a,b)=>a.precio-b.precio);
  if(orden==="precio-desc")resultado.sort((a,b)=>b.precio-a.precio);
  if(orden==="nombre")resultado.sort((a,b)=>a.nombre.localeCompare(b.nombre,"es"));
  return resultado;
}
