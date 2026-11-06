import { ShoppingCart } from 'lucide-react'
import { useCart } from '../cart/useCart'

export default function CartTrigger() {
  const { cantidadTotal, abierto, abrirCarrito } = useCart()
  return (
    <button type="button" className="cart-trigger"
      onClick={abrirCarrito}
      aria-haspopup="dialog"
      aria-expanded={abierto}
      aria-label={cantidadTotal ? 'Abrir carrito con ' + cantidadTotal + ' productos' : 'Abrir carrito vacío'}>
      <ShoppingCart size={21} aria-hidden="true" />
      {cantidadTotal > 0 && <span className="cart-badge" aria-hidden="true">{cantidadTotal > 99 ? '99+' : cantidadTotal}</span>}
    </button>
  )
}
