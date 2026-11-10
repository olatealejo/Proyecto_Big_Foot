import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import zapatilla from '../assets/chorizo-parmesano-lateral-izquierda.png'
import suela from '../assets/chorizo-parmesano-suela.png'
import superior from '../assets/chorizo-parmesano-vista-superior.png'
import trasera from '../assets/chorizo-parmesano-vista-trasera.png'
import { useCatalog } from '../catalogo/useCatalog'
import { formatoPrecio } from '../cart/catalogo'
import AddToCart from '../components/AddToCart'
import BrandLogo from '../components/BrandLogo'
import CartTrigger from '../components/CartTrigger'
import ProductoNoDisponible from './ProductoNoDisponible'
import './ProductoDetalle.css'
import './ProductoDetalle.galeria.css'

const imagenesLocales = [
  { src: zapatilla, nombre: 'Lateral izquierda' },
  { src: superior, nombre: 'Vista superior' },
  { src: suela, nombre: 'Suela' },
  { src: trasera, nombre: 'Vista trasera' },
]

function ProductoDetalle() {
  const [imagenActiva, setImagenActiva] = useState(0)
  const { productos, cargando } = useCatalog()
  const producto = productos['chorizo-parmesano']

  const galeria =
    producto?.imagenUrl && producto.imagenes.length > 0
      ? producto.imagenes
      : imagenesLocales.map((imagen, indice) =>
          indice === 0
            ? { ...imagen, src: producto?.imagen || imagen.src }
            : imagen,
        )
  const imagenMostrada = galeria[imagenActiva] || galeria[0]

  const cambiarImagen = (direccion) => {
    setImagenActiva((indice) =>
      (indice + direccion + galeria.length) % galeria.length,
    )
  }

  if (cargando) {
    return (
      <main className="detalle-pagina">
        <p>Cargando producto...</p>
      </main>
    )
  }

  if (!producto) return <ProductoNoDisponible />

  return (
    <div className="detalle-pagina">
      <nav className="detalle-nav">
        <Link to="/productos" className="detalle-volver">
          <ArrowLeft size={20} />
          <span>Volver a productos</span>
        </Link>
        <BrandLogo className="detalle-logo" />
        <CartTrigger />
      </nav>

      <main className="detalle-contenido">
        <section
          className="detalle-galeria"
          aria-label={'Imágenes de ' + producto.nombre}
        >
          <div className="detalle-imagen-principal">
            <img
              src={imagenMostrada.src}
              alt={producto.nombre + ' — ' + imagenMostrada.nombre}
            />
            {galeria.length > 1 && (
              <>
                <button
                  type="button"
                  className="detalle-flecha detalle-flecha-izquierda"
                  onClick={() => cambiarImagen(-1)}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className="detalle-flecha detalle-flecha-derecha"
                  onClick={() => cambiarImagen(1)}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {galeria.length > 1 && (
            <div
              className="detalle-miniaturas"
              aria-label="Elegir vista de la zapatilla"
            >
              {galeria.map((imagen, indice) => (
                <button
                  key={imagen.nombre + imagen.src}
                  type="button"
                  className={
                    'detalle-miniatura'
                    + (imagenActiva === indice
                      ? ' detalle-miniatura-activa'
                      : '')
                  }
                  aria-label={
                    'Mostrar ' + imagen.nombre.toLowerCase()
                  }
                  aria-pressed={imagenActiva === indice}
                  onClick={() => setImagenActiva(indice)}
                >
                  <img src={imagen.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          <p className="detalle-imagen-nota">
            {imagenMostrada.nombre} · THE BIG FOOT
          </p>
        </section>

        <section className="detalle-info">
          <p className="detalle-categoria">
            {producto.categoria.toUpperCase()}
          </p>
          <h1>{producto.nombre}</h1>
          <p className="detalle-subtitulo">
            {producto.subtitulo}
          </p>
          <p className="detalle-precio">
            {formatoPrecio(producto.precio)}
          </p>
          <p className="detalle-descripcion">
            {producto.descripcion || 'Modelo The Big Foot.'}
          </p>

          <AddToCart sku="chorizo-parmesano" />

          <div className="detalle-beneficios">
            <p>
              <Truck size={19} /> Envíos a todo el país
            </p>
            <p>
              <ShieldCheck size={19} /> Compra segura
            </p>
          </div>

          <div className="detalle-acordeon">
            <details>
              <summary>Descripción del producto</summary>
              <p>
                {producto.descripcionCompleta
                  || producto.descripcion}
              </p>
            </details>
            <details>
              <summary>Envíos y cambios</summary>
              <p>
                Consultá las opciones de envío y cambios
                disponibles antes de finalizar tu compra.
              </p>
            </details>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ProductoDetalle
