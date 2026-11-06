import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, ChevronLeft, ChevronRight, ShieldCheck, Truck } from 'lucide-react'

import zapatilla from '../assets/chorizo-parmesano-lateral-izquierda.png'
import suela from '../assets/chorizo-parmesano-suela.png'
import superior from '../assets/chorizo-parmesano-vista-superior.png'
import trasera from '../assets/chorizo-parmesano-vista-trasera.png'
import './ProductoDetalle.css'
import './ProductoDetalle.galeria.css'

const talles = [38, 39, 40, 41, 42, 43, 44, 45]

const imagenes = [
  { src: zapatilla, nombre: 'Lateral izquierda' },
  { src: superior, nombre: 'Vista superior' },
  { src: suela, nombre: 'Suela' },
  { src: trasera, nombre: 'Vista trasera' },
]

function ProductoDetalle() {
  const [talleSeleccionado, setTalleSeleccionado] = useState(null)
  const [agregado, setAgregado] = useState(false)
  const [imagenActiva, setImagenActiva] = useState(0)

  const cambiarImagen = (direccion) => {
    setImagenActiva((indice) => (indice + direccion + imagenes.length) % imagenes.length)
  }

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
            <img src={imagenes[imagenActiva].src} alt={`Big Foot Chorizo Parmesano — ${imagenes[imagenActiva].nombre}`} />
            {imagenes.length > 1 && <>
              <button type="button" className="detalle-flecha detalle-flecha-izquierda" onClick={() => cambiarImagen(-1)} aria-label="Imagen anterior"><ChevronLeft size={24} /></button>
              <button type="button" className="detalle-flecha detalle-flecha-derecha" onClick={() => cambiarImagen(1)} aria-label="Imagen siguiente"><ChevronRight size={24} /></button>
            </>}
          </div>
          {imagenes.length > 1 && <div className="detalle-miniaturas" aria-label="Elegir vista de la zapatilla">
            {imagenes.map((imagen, indice) => (
              <button key={imagen.nombre} type="button" className={`detalle-miniatura${imagenActiva === indice ? ' detalle-miniatura-activa' : ''}`} aria-label={`Mostrar ${imagen.nombre.toLowerCase()}`} aria-pressed={imagenActiva === indice} onClick={() => setImagenActiva(indice)}>
                <img src={imagen.src} alt="" loading="lazy" />
              </button>
            ))}
          </div>}
          <p className="detalle-imagen-nota">{imagenes[imagenActiva].nombre} · THE BIG FOOT · COLECCIÓN DE CANCHA</p>
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
