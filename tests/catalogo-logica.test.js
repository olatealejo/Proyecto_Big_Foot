import test from 'node:test'
import assert from 'node:assert/strict'
import { Producto } from '../src/cart/Producto.js'
import { filtrarProductos } from '../src/cart/filtros.js'
import { normalizarCarrito, agregarLinea, cambiarCantidadLinea, quitarLinea, calcularResumen } from '../src/cart/operaciones.js'

const chorizo = new Producto({ sku: 'chorizo', nombre: 'Big Foot Chorizo Parmesano', modelo: 'Chorizo Parmesano', precio: 80000, imagen: '', ruta: '/productos/chorizo-parmesano' })
const molino1 = new Producto({ sku: 'm1', nombre: 'Big Foot Molino 1', modelo: 'Molino 1', precio: 110000, imagen: '', ruta: '/productos/molino-1' })
const molino2 = new Producto({ sku: 'm2', nombre: 'Big Foot Molino 2', modelo: 'Molino 2', precio: 150000, imagen: '', ruta: '/productos/molino-2' })
const productos = { chorizo, m1: molino1, m2: molino2 }
const lista = Object.values(productos)

test('clase Producto valida talles y calcula el valor por cantidad', () => {
  assert.equal(chorizo.permiteTalle(42), true)
  assert.equal(chorizo.permiteTalle(50), false)
  assert.equal(molino1.calcularImporte(3), 330000)
  assert.equal(molino1.calcularImporte(-1), 0)
})
test('filtros combinados: nombre, modelo, precio y orden', () => {
  assert.deepEqual(filtrarProductos(lista, { texto: 'CHORIZO' }).map(p=>p.sku), ['chorizo'])
  assert.deepEqual(filtrarProductos(lista, { modelo: 'Molino 1', precioMaximo: '110000' }).map(p=>p.sku), ['m1'])
  assert.deepEqual(filtrarProductos(lista, { orden: 'precio-desc' }).map(p=>p.sku), ['m2','m1','chorizo'])
  assert.deepEqual(filtrarProductos(lista, { texto: 'no existe' }), [])
})
test('carrito descarta datos inválidos y agrupa talles iguales', () => {
  const items = normalizarCarrito([{ sku: 'chorizo', talle: 42, cantidad: 1 }, { sku: 'chorizo', talle: 42, cantidad: 2 }, { sku: 'm1', talle: 55, cantidad: 1 }, { sku: 'inventado', talle: 42, cantidad: 2 }], productos)
  assert.deepEqual(items, [{ sku: 'chorizo', talle: 42, cantidad: 3 }])
})
test('subtotal y contador se recalculan por producto y cantidad', () => {
  let items = agregarLinea([], 'chorizo', 42, productos)
  items = agregarLinea(items, 'm1', 40, productos)
  items = cambiarCantidadLinea(items, 'm1', 40, 2, productos)
  assert.deepEqual(calcularResumen(items, productos), { cantidadTotal: 3, subtotal: 300000 })
  assert.deepEqual(calcularResumen(quitarLinea(items, 'chorizo', 42), productos), { cantidadTotal: 2, subtotal: 220000 })
})
test('cantidad cero quita la línea y el límite de 99 no simula stock', () => {
  const items = normalizarCarrito([{ sku: 'm1', talle: 39, cantidad: 200 }], productos)
  assert.equal(items[0].cantidad, 99)
  assert.deepEqual(cambiarCantidadLinea(items, 'm1', 39, 0, productos), [])
})
