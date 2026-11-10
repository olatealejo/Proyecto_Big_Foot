import test from 'node:test'
import assert from 'node:assert/strict'

import { Producto } from '../src/cart/Producto.js'
import {
  combinarCatalogos,
  validarFormularioProducto,
} from '../src/catalogo/productosLogica.js'

const base = {
  'molino-1': new Producto({
    sku: 'molino-1',
    nombre: 'Big Foot Molino 1',
    modelo: 'Molino 1',
    precio: 110000,
    imagen: 'original.png',
    ruta: '/productos/molino-1',
  }),
}

test(
  'edición persistida reemplaza precio e imagen y conserva ruta',
  () => {
    const resultado = combinarCatalogos(base, [{
      sku: 'molino-1',
      nombre: 'Molino renovado',
      modelo: 'Molino 1',
      precio: 125000,
      imagenUrl: 'https://site.test/m.png',
      descripcion: 'Versión nueva',
      activo: true,
    }])

    assert.equal(
      resultado.productos['molino-1'].precio,
      125000,
    )
    assert.equal(
      resultado.productos['molino-1'].imagen,
      'https://site.test/m.png',
    )
    assert.equal(
      resultado.productos['molino-1'].ruta,
      '/productos/molino-1',
    )
  },
)

test(
  'modelo archivado no reaparece desde el catálogo base',
  () => {
    const resultado = combinarCatalogos(base, [{
      sku: 'molino-1',
      nombre: 'Big Foot Molino 1',
      modelo: 'Molino 1',
      precio: 110000,
      imagenUrl: '',
      activo: false,
    }])

    assert.equal(resultado.productos['molino-1'], undefined)
    assert.equal(resultado.archivados.length, 1)
  },
)

test('nuevo producto se incorpora y aparece en ruta propia', () => {
  const resultado = combinarCatalogos(base, [{
    sku: 'nuevo1',
    nombre: 'Big Foot Nuevo',
    modelo: 'Nuevo',
    precio: 135000,
    imagenUrl: 'https://site.test/n.png',
    activo: true,
  }])

  assert.equal(
    resultado.productos.nuevo1.ruta,
    '/productos/nuevo1',
  )
})

test(
  'validación exige precio positivo e imagen HTTPS nueva',
  () => {
    assert.throws(() =>
      validarFormularioProducto({
        nombre: 'Modelo',
        modelo: 'X',
        precio: 0,
        imagenUrl: 'https://site.test/x',
      }, true),
    )
    assert.throws(() =>
      validarFormularioProducto({
        nombre: 'Modelo',
        modelo: 'Nuevo',
        precio: 100,
        imagenUrl: 'http://site.test/x',
      }, true),
    )
    assert.throws(() =>
      validarFormularioProducto({
        nombre: 'Modelo',
        modelo: 'Nuevo',
        precio: 100,
        imagenUrl: '',
      }, true),
    )

    const producto = validarFormularioProducto({
      nombre: 'Modelo',
      modelo: 'Nuevo',
      precio: '90000',
      imagenUrl: 'https://site.test/p.png',
    }, true)

    assert.equal(producto.precio, 90000)
  },
)

test(
  'valida y conserva todos los datos de la ficha completa',
  () => {
    const producto = validarFormularioProducto({
      nombre: 'Big Foot Completa',
      modelo: 'Completa',
      categoria: 'Básquet / High-top',
      subtitulo: 'Diseño de cancha.',
      descripcion: 'Descripción breve.',
      descripcionCompleta: 'Descripción completa del producto.',
      precio: '120000',
      imagenes: [
        {
          url: 'https://site.test/frente.png',
          nombre: 'Frente',
        },
        {
          url: 'https://site.test/suela.png',
          nombre: 'Suela',
        },
      ],
      talles: [39, 41, 43],
    }, true)

    assert.equal(producto.imagenUrl, producto.imagenes[0].url)
    assert.deepEqual(producto.talles, [39, 41, 43])
    assert.equal(producto.imagenes.length, 2)
    assert.equal(
      producto.descripcionCompleta,
      'Descripción completa del producto.',
    )
  },
)
