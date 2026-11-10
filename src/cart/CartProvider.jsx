import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './CartContext'
import { useCatalog } from '../catalogo/useCatalog'
import {
  MAX_CANTIDAD, agregarLinea, cambiarCantidadLinea,
  quitarLinea, normalizarCarrito, calcularResumen,
} from './operaciones.js'

const STORAGE_KEY = 'bigfoot-carrito-v1'
function cargar() {
  try {
    if (typeof window === 'undefined') return []
    const datos = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(datos) ? datos.slice(0, 500) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { productos, cargando } = useCatalog()
  const [items, setItems] = useState(cargar)
  const [abierto, setAbierto] = useState(false)

  // No eliminar un producto nuevo del carrito mientras Firestore todavía carga.
  const visibles = useMemo(() => normalizarCarrito(items, productos), [items, productos])

  useEffect(() => {
    if (cargando) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visibles))
    } catch {
      // El carrito permanece operativo durante la sesión sin localStorage.
    }
  }, [visibles, cargando])

  const abrirCarrito = useCallback(() => setAbierto(true), [])
  const cerrarCarrito = useCallback(() => setAbierto(false), [])

  const agregarProducto = useCallback((sku, talle) => {
    const producto = productos[sku]
    if (!producto || !producto.permiteTalle(talle) || cargando) return false
    setItems((actual) => agregarLinea(actual, sku, talle, productos))
    setAbierto(true)
    return true
  }, [productos, cargando])

  const cambiarCantidad = useCallback((sku, talle, cantidad) => {
    setItems((actual) => cambiarCantidadLinea(actual, sku, talle, cantidad, productos))
  }, [productos])

  const quitarProducto = useCallback((sku, talle) => {
    setItems((actual) => quitarLinea(actual, sku, talle))
  }, [])

  const resumen = calcularResumen(visibles, productos)
  const valor = useMemo(() => ({
    items: visibles, abierto, cantidadTotal: resumen.cantidadTotal, subtotal: resumen.subtotal,
    maxCantidad: MAX_CANTIDAD, cargando,
    abrirCarrito, cerrarCarrito, agregarProducto, cambiarCantidad, quitarProducto,
  }), [visibles, abierto, resumen.cantidadTotal, resumen.subtotal, cargando,
    abrirCarrito, cerrarCarrito, agregarProducto, cambiarCantidad, quitarProducto])

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}
