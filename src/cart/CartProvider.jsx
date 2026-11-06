import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './CartContext'
import { PRODUCTOS, TALLES } from './catalogo'

const STORAGE_KEY = 'bigfoot-carrito-v1'
const MAX = 99

function cargar() {
  try {
    const datos = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(datos)) return []
    const mapa = new Map()
    for (const dato of datos) {
      const sku = dato?.sku
      const talle = Number(dato?.talle)
      const cantidad = Number(dato?.cantidad)
      if (!PRODUCTOS[sku] || !TALLES.includes(talle) || !Number.isInteger(cantidad) || cantidad < 1) continue
      const clave = sku + ':' + talle
      const anterior = mapa.get(clave)?.cantidad || 0
      mapa.set(clave, { sku, talle, cantidad: Math.min(MAX, anterior + cantidad) })
    }
    return [...mapa.values()]
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
      // En navegación privada el estado se conserva durante la sesión.
    }
  }, [items])

  const abrirCarrito = useCallback(() => setAbierto(true), [])
  const cerrarCarrito = useCallback(() => setAbierto(false), [])

  const agregarProducto = useCallback((sku, talle) => {
    const numero = Number(talle)
    if (!PRODUCTOS[sku] || !TALLES.includes(numero)) return false
    setItems((anterior) => {
      if (!anterior.some((p) => p.sku === sku && p.talle === numero)) {
        return [...anterior, { sku, talle: numero, cantidad: 1 }]
      }
      return anterior.map((p) =>
        p.sku === sku && p.talle === numero
          ? { ...p, cantidad: Math.min(MAX, p.cantidad + 1) }
          : p
      )
    })
    setAbierto(true)
    return true
  }, [])

  const cambiarCantidad = useCallback((sku, talle, cantidad) => {
    if (!Number.isInteger(cantidad)) return
    setItems((anterior) => anterior.map((p) =>
      p.sku === sku && p.talle === talle ? { ...p, cantidad: Math.min(MAX, cantidad) } : p
    ).filter((p) => p.cantidad > 0))
  }, [])

  const quitarProducto = useCallback((sku, talle) => {
    setItems((anterior) => anterior.filter((p) => p.sku !== sku || p.talle !== talle))
  }, [])

  const cantidadTotal = items.reduce((sum, p) => sum + p.cantidad, 0)
  const subtotal = items.reduce((sum, p) => sum + PRODUCTOS[p.sku].precio * p.cantidad, 0)
  const valor = useMemo(() => ({
    items, abierto, cantidadTotal, subtotal, abrirCarrito, cerrarCarrito, agregarProducto,
    cambiarCantidad, quitarProducto,
  }), [items, abierto, cantidadTotal, subtotal, abrirCarrito, cerrarCarrito,
    agregarProducto, cambiarCantidad, quitarProducto])

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}
