import chorizo from '../assets/chorizo-parmesano-lateral-izquierda.png'
import molino1 from '../assets/molino-1-lateral-izquierda.png'
import molino2 from '../assets/molino-2-lateral-izquierda.png'
import { Producto } from './Producto.js'
export { TALLES } from './Producto.js'

export const PRODUCTOS = {
  'chorizo-parmesano': new Producto({
    sku: 'chorizo-parmesano', nombre: 'Big Foot Chorizo Parmesano', modelo: 'Chorizo Parmesano',
    precio: 80000, imagen: chorizo, ruta: '/productos/chorizo-parmesano', descripcion: 'Diseñadas para destacar dentro y fuera de la cancha. Caña alta en azul y blanco.',
  }),
  'molino-1': new Producto({
    sku: 'molino-1', nombre: 'Big Foot Molino 1', modelo: 'Molino 1',
    precio: 110000, imagen: molino1, ruta: '/productos/molino-1', descripcion: 'Zapatillas negras y blancas con perfil deportivo.',
  }),
  'molino-2': new Producto({
    sku: 'molino-2', nombre: 'Big Foot Molino 2', modelo: 'Molino 2',
    precio: 150000, imagen: molino2, ruta: '/productos/molino-2', descripcion: 'Modelo plateado iridiscente con detalles violetas y turquesa.',
  }),
}

export function formatoPrecio(importe) {
  return '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(importe)
}
