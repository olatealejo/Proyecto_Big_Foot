import chorizo from '../assets/chorizo-parmesano-lateral-izquierda.png'
import molino1 from '../assets/molino-1-lateral-izquierda.png'
import molino2 from '../assets/molino-2-lateral-izquierda.png'

export const TALLES = [38, 39, 40, 41, 42, 43, 44, 45]

export const PRODUCTOS = {
  'chorizo-parmesano': { nombre: 'Big Foot Chorizo Parmesano', precio: 80000, imagen: chorizo, ruta: '/productos/chorizo-parmesano' },
  'molino-1': { nombre: 'Big Foot Molino 1', precio: 110000, imagen: molino1, ruta: '/productos/molino-1' },
  'molino-2': { nombre: 'Big Foot Molino 2', precio: 150000, imagen: molino2, ruta: '/productos/molino-2' },
}

export function formatoPrecio(importe) {
  return '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(importe)
}
