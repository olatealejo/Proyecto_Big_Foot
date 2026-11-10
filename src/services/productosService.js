import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { PRODUCTOS } from '../cart/catalogo'
import { validarFormularioProducto } from '../catalogo/productosLogica'

function requireDb() {
  if (!db) throw new Error('Firebase no está configurado para guardar productos.')
}
function requireAdmin(esAdmin, usuario) {
  if (!esAdmin || !usuario?.uid) throw new Error('No tenés permisos de administrador.')
}
export async function guardarProducto({ datos, productoActual, usuario, esAdmin }) {
  requireDb()
  requireAdmin(esAdmin, usuario)
  const nuevo = !productoActual
  const sku = productoActual?.sku || doc(collection(db, 'productos')).id
  const campos = validarFormularioProducto(datos, nuevo, Boolean(PRODUCTOS[sku]))
  await setDoc(doc(db, 'productos', sku), {
    ...campos, sku, activo: true, motivoBaja: '',
    modificadoPor: usuario.uid,
    fechaActualizacion: serverTimestamp(),
    ...(!productoActual ? { fechaCreacion: serverTimestamp() } : {}),
  }, { merge: true })
  return sku
}
export async function cambiarEstadoProducto({ producto, activo, motivo, usuario, esAdmin }) {
  requireDb()
  requireAdmin(esAdmin, usuario)
  if (!producto) throw new Error('Producto no encontrado.')
  const motivoBaja = activo ? '' : String(motivo || '').trim()
  if (!activo && motivoBaja.length < 10) {
    throw new Error('Escribí al menos 10 caracteres explicando el motivo de la baja.')
  }
  // Baja lógica: se conserva el registro, su historial y el motivo como en Comunidad.
  const campos = validarFormularioProducto({
    nombre: producto.nombre, modelo: producto.modelo,
    descripcion: producto.descripcion, precio: producto.precio,
    imagenUrl: producto.imagenUrl || '',
  }, false, Boolean(PRODUCTOS[producto.sku]))
  await setDoc(doc(db, 'productos', producto.sku), {
    ...campos, sku: producto.sku, activo, motivoBaja,
    modificadoPor: usuario.uid, fechaActualizacion: serverTimestamp(),
  }, { merge: true })
}
