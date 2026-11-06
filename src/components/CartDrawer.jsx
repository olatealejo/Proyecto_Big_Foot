import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Minus, Plus, ShoppingBasket, Trash2, X } from 'lucide-react'
import { PRODUCTOS, formatoPrecio } from '../cart/catalogo'
import { useCart } from '../cart/useCart'
import './Carrito.css'

export default function CartDrawer() {
  const {
    items, abierto, cantidadTotal, subtotal,
    cerrarCarrito, cambiarCantidad, quitarProducto,
  } = useCart()
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const location = useLocation()

  useEffect(() => { cerrarCarrito() }, [location.pathname, cerrarCarrito])

  useEffect(() => {
    if (!abierto) return undefined

    const focoAnterior = document.activeElement
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const teclado = (evento) => {
      if (evento.key === 'Escape') {
        cerrarCarrito()
        return
      }
      if (evento.key !== 'Tab') return
      const focos = Array.from(panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || [])
      if (focos.length === 0) return
      if (evento.shiftKey && document.activeElement === focos[0]) {
        evento.preventDefault()
        focos[focos.length - 1].focus()
      } else if (!evento.shiftKey && document.activeElement === focos[focos.length - 1]) {
        evento.preventDefault()
        focos[0].focus()
      }
    }

    document.addEventListener('keydown', teclado)
    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', teclado)
      if (focoAnterior instanceof HTMLElement) focoAnterior.focus()
    }
  }, [abierto, cerrarCarrito])

  return (
    <div className={'carrito-capa' + (abierto ? ' carrito-abierto' : '')} inert={!abierto}>
      <button type="button" className="carrito-overlay" onClick={cerrarCarrito}
        aria-label="Cerrar carrito" />
      <aside className="carrito-panel" role="dialog" aria-modal="true"
        aria-label="Tu carrito" ref={panelRef}>
        <header className="carrito-header">
          <h2>TU CARRITO ({cantidadTotal})</h2>
          <button type="button" ref={closeRef} className="carrito-cerrar" onClick={cerrarCarrito}
            aria-label="Cerrar carrito"><X size={24}/></button>
        </header>
        {items.length === 0 ? (
          <div className="carrito-vacio">
            <ShoppingBasket size={58} strokeWidth={1.5} />
            <h3>EMPEZÁ TUS PRIMEROS PASOS</h3>
            <p>Todavía no agregaste productos a tu carrito.</p>
            <Link to="/productos" className="carrito-ver" onClick={cerrarCarrito}>VER PRODUCTOS</Link>
          </div>
        ) : (
          <>
            <div className="carrito-lista">
              {items.map((item) => {
                const producto = PRODUCTOS[item.sku]
                return (
                  <article className="carrito-item" key={item.sku + ':' + item.talle}>
                    <Link to={producto.ruta} onClick={cerrarCarrito} aria-label={'Ver ' + producto.nombre}>
                      <img src={producto.imagen} alt={producto.nombre}/>
                    </Link>
                    <div className="carrito-item-info">
                      <Link to={producto.ruta} onClick={cerrarCarrito} className="carrito-nombre">
                        {producto.nombre}
                      </Link>
                      <span>Talle AR {item.talle}</span>
                      <span>{formatoPrecio(producto.precio)} por unidad</span>
                      <div className="carrito-acciones">
                        <div className="carrito-cantidad">
                          <button type="button" onClick={() => cambiarCantidad(item.sku, item.talle, item.cantidad - 1)}
                            aria-label={'Quitar una unidad de ' + producto.nombre + ' talle ' + item.talle}>
                            <Minus size={15}/>
                          </button>
                          <span>{item.cantidad}</span>
                          <button type="button" disabled={item.cantidad >= 99}
                            onClick={() => cambiarCantidad(item.sku, item.talle, item.cantidad + 1)}
                            aria-label={'Agregar una unidad de ' + producto.nombre + ' talle ' + item.talle}>
                            <Plus size={15}/>
                          </button>
                        </div>
                        <button className="carrito-eliminar" type="button"
                          onClick={() => quitarProducto(item.sku, item.talle)}
                          aria-label={'Eliminar ' + producto.nombre + ' talle ' + item.talle}>
                          <Trash2 size={18}/>
                        </button>
                      </div>
                      <strong>{formatoPrecio(producto.precio * item.cantidad)}</strong>
                    </div>
                  </article>
                )
              })}
            </div>
            <footer className="carrito-footer">
              <div className="carrito-subtotal">
                <strong>SUBTOTAL</strong>
                <strong aria-live="polite">{formatoPrecio(subtotal)}</strong>
              </div>
              <p>Envío y descuentos se calculan en el siguiente paso.</p>
              <button type="button" disabled title="El pago online no está habilitado">
                FINALIZAR COMPRA · PRÓXIMAMENTE
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
