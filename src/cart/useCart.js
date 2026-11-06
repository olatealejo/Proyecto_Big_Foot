import { useContext } from 'react'
import { CartContext } from './CartContext'

export function useCart() {
  const contexto = useContext(CartContext)
  if (!contexto) throw new Error('El carrito debe estar dentro de CartProvider')
  return contexto
}
