import { useState } from 'react'
import { Check } from 'lucide-react'
import { TALLES, PRODUCTOS } from '../cart/catalogo'
import { useCart } from '../cart/useCart'

export default function AddToCart({ sku }) {
  const [talle, setTalle] = useState(null)
  const [agregado, setAgregado] = useState(false)
  const { agregarProducto } = useCart()

  function agregar() {
    if (talle === null) return
    if (agregarProducto(sku, talle)) setAgregado(true)
  }

  return (
    <>
      <div className="detalle-talles">
        <div className="detalle-talles-cabecera">
          <h2>Seleccioná tu talle</h2>
          <span>AR</span>
        </div>
        <div className="detalle-talles-grid">
          {TALLES.map((numero) => (
            <button key={numero} type="button"
              className={talle === numero ? 'talle talle-activo' : 'talle'}
              aria-pressed={talle === numero}
              onClick={() => { setTalle(numero); setAgregado(false) }}>
              {numero}
            </button>
          ))}
        </div>
        {talle === null && <p className="detalle-ayuda">Elegí un talle para continuar.</p>}
      </div>
      <button type="button" className="detalle-agregar" disabled={talle === null} onClick={agregar}>
        {agregado ? <><Check size={19} /> Agregar otra unidad</> : 'Agregar al carrito'}
      </button>
      {agregado && (
        <p className="detalle-confirmacion" role="status">
          {PRODUCTOS[sku].nombre} · Talle {talle} agregado al carrito.
        </p>
      )}
    </>
  )
}
