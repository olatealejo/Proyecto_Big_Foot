import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, ShieldCheck, Truck } from 'lucide-react'

import zapatilla from '../assets/The-Big-Foot-ChorizoParmezano1.jpeg'
import './ProductoDetalle.css'

const talles = [38, 39, 40, 41, 42, 43, 44, 45]

function ProductoDetalle() {
  const [talleSeleccionado, setTalleSeleccionado] = useState(null)
  const [agregado, setAgregado] = useState(false)

  const agregarAlCarrito = () => {
    if (!talleSeleccionado) return
    setAgregado(true)
  }

  return (
    <div className="detalle-pagina">
      <nav className="detalle-nav">
        <Link to="/productos" className="detalle-volver">
          <ArrowLeft size={20} />
          <span>Volver a productos</span>
        </Link>
      </nav>

      <main className="detalle-contenido">
        <section className="detalle-galeria" aria-label="Imágenes del producto">
          <div className="detalle-imagen-principal">
            <img
              src={zapatilla}
              alt="Big Foot Chorizo Parmesano, zapatilla de básquet de caña alta"
            />
          </div>
          <p className="detalle-imagen-nota">THE BIG FOOT · COLECCIÓN DE CANCHA</p>
        </section>

        <section className="detalle-info">
          <p className="detalle-categoria">BÁSQUET / HIGH-TOP</p>
          <h1>Big Foot Chorizo Parmesano</h1>
          <p className="detalle-subtitulo">Un clásico de cancha con identidad propia.</p>
          <p className="detalle-precio">$80.000</p>

          <p className="detalle-descripcion">
            Diseñadas para destacar dentro y fuera de la cancha. Su silueta de
            caña alta y su combinación de azul, blanco y detalles Big Foot le
            dan personalidad a cada paso.
          </p>

          <div className="detalle-talles">
            <div className="detalle-talles-cabecera">
              <h2>Seleccioná tu talle</h2>
              <span>AR</span>
            </div>
            <div className="detalle-talles-grid">
              {talles.map((talle) => (
                <button
                  key={talle}
                  type="button"
                  className={talleSeleccionado === talle ? 'talle talle-activo' : 'talle'}
                  aria-pressed={talleSeleccionado === talle}
                  onClick={() => {
                    setTalleSeleccionado(talle)
                    setAgregado(false)
                  }}
                >
                  {talle}
                </button>
              ))}
            </div>
            {!talleSeleccionado && (
              <p className="detalle-ayuda">Elegí un talle para continuar.</p>
            )}
          </div>

          <button
            type="button"
            className="detalle-agregar"
            onClick={agregarAlCarrito}
            disabled={!talleSeleccionado}
          >
            {agregado ? <><Check size={19} /> Producto agregado</> : 'Agregar al carrito'}
          </button>

          {agregado && (
            <p className="detalle-confirmacion" role="status">
              Big Foot Chorizo Parmesano · Talle {talleSeleccionado} seleccionado.
            </p>
          )}

          <div className="detalle-beneficios">
            <p><Truck size={19} /> Envíos a todo el país</p>
            <p><ShieldCheck size={19} /> Compra segura</p>
          </div>

          <div className="detalle-acordeon">
            <details>
              <summary>Descripción del producto</summary>
              <p>Modelo de básquet The Big Foot. Color azul, blanco y detalles gráficos de la marca.</p>
            </details>
            <details>
              <summary>Envíos y cambios</summary>
              <p>Consultá las opciones de envío y cambios disponibles antes de finalizar tu compra.</p>
            </details>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ProductoDetalle
