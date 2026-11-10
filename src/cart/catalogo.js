import chorizo from '../assets/chorizo-parmesano-lateral-izquierda.png'
import molino1 from '../assets/molino-1-lateral-izquierda.png'
import molino2 from '../assets/molino-2-lateral-izquierda.png'
import { Producto } from './Producto.js'

export { TALLES } from './Producto.js'

export const PRODUCTOS = {
  'chorizo-parmesano': new Producto({
    sku: 'chorizo-parmesano',
    nombre: 'Big Foot Chorizo Parmesano',
    modelo: 'Chorizo Parmesano',
    categoria: 'Básquet / High-top',
    subtitulo: 'Un clásico de cancha con identidad propia.',
    precio: 80000,
    imagen: chorizo,
    ruta: '/productos/chorizo-parmesano',
    descripcion:
      'Diseñadas para destacar dentro y fuera de la cancha. Caña alta en azul y blanco.',
    descripcionCompleta:
      'Modelo de básquet The Big Foot. Color azul, blanco y detalles gráficos de la marca.',
  }),
  'molino-1': new Producto({
    sku: 'molino-1',
    nombre: 'Big Foot Molino 1',
    modelo: 'Molino 1',
    categoria: 'Zapatillas / Molino 1',
    subtitulo: 'Diseño en negro y blanco con identidad propia.',
    precio: 110000,
    imagen: molino1,
    ruta: '/productos/molino-1',
    descripcion:
      'Zapatillas negras y blancas con perfil deportivo.',
    descripcionCompleta:
      'Big Foot Molino 1, modelo negro y blanco. Galería de seis fotografías.',
  }),
  'molino-2': new Producto({
    sku: 'molino-2',
    nombre: 'Big Foot Molino 2',
    modelo: 'Molino 2',
    categoria: 'Zapatillas / Molino 2',
    subtitulo:
      'Diseño iridiscente en plateado, con detalles negros, violetas y turquesa.',
    precio: 150000,
    imagen: molino2,
    ruta: '/productos/molino-2',
    descripcion:
      'Modelo plateado iridiscente con detalles violetas y turquesa.',
    descripcionCompleta:
      'Big Foot Molino 2, modelo plateado iridiscente. Galería de seis fotografías.',
  }),
}

export function formatoPrecio(importe) {
  return '$' + new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(importe)
}
