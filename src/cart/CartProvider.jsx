import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './CartContext'
import { PRODUCTOS } from './catalogo'
import {
  MAX_CANTIDAD, agregarLinea, cambiarCantidadLinea,
  quitarLinea, normalizarCarrito, calcularResumen,
} from './operaciones.js'

const STORAGE_KEY = 'bigfoot-carrito-v1'

function cargar() {
  try {
    if (typeof window === 'undefined') return []
    return normalizarCarrito(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'), PRODUCTOS)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(cargar)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // El carrito sigue funcionando si el navegador bloquea localStorage.
    }
  }, [items])

  const abrirCarrito = useCallback(() => setAbierto(true), [])
  const cerrarCarrito = useCallback(() => setAbierto(false), [])

  const agregarProducto = useCallback((sku, talle) => {
    const producto = PRODUCTOS[sku]
    if (!producto || !producto.permiteTalle(talle)) return false
    setItems((actual) => agregarLinea(actual, sku, talle, PRODUCTOS))
    setAbierto(true)
    return true
  }, [])

  const cambiarCantidad = useCallback((sku, talle, cantidad) => {
    setItems((actual) => cambiarCantidadLinea(actual, sku, talle, cantidad, PRODUCTOS))
  }, [])

  const quitarProducto = useCallback((sku, talle) => {
    setItems((actual) => quitarLinea(actual, sku, talle))
  }, [])

  const resumen = calcularResumen(items, PRODUCTOS)
  const valor = useMemo(() => ({
    items, abierto, cantidadTotal: resumen.cantidadTotal, subtotal: resumen.subtotal,
    maxCantidad: MAX_CANTIDAD,
    abrirCarrito, cerrarCarrito, agregarProducto, cambiarCantidad, quitarProducto,
  }), [items, abierto, resumen.cantidadTotal, resumen.subtotal, abrirCarrito, cerrarCarrito,
    agregarProducto, cambiarCantidad, quitarProducto])

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}
