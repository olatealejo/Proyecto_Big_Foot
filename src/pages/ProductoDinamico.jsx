import { useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  Link,
  useParams,
} from 'react-router-dom'

import { formatoPrecio } from '../cart/catalogo'
import { useCatalog } from '../catalogo/useCatalog'
import AddToCart from '../components/AddToCart'
import BrandLogo from '../components/BrandLogo'
import CartTrigger from '../components/CartTrigger'
import ProductoNoDisponible from './ProductoNoDisponible'
import './ProductoDetalle.css'
import './ProductoDetalle.galeria.css'

function ProductoDinamicoContenido({ sku }) {
  const { productos, cargando } = useCatalog()
  const [imagenActiva, setImagenActiva] = useState(0)
  const producto = productos[sku]

  if (cargando) {
    return (
      <main className="detalle-pagina">
        <p>Cargando producto...</p>
      </main>
    )
  }

  if (!producto) {
    return <ProductoNoDisponible />
  }

  const imagenes =
    producto.imagenes.length > 0
      ? producto.imagenes
      : [{
          src: producto.imagen,
          nombre: 'Vista principal',
        }]
  const imagenActual =
    imagenes[imagenActiva] || imagenes[0]

  function cambiarImagen(direccion) {
    setImagenActiva((indice) =>
      (indice + direccion + imagenes.length)
      % imagenes.length,
    )
  }

  return (
    <div className="detalle-pagina">
      <nav
        className="detalle-nav"
        aria-label="Navegación del producto"
      >
        <Link
          to="/productos"
          className="detalle-volver"
        >
          <ArrowLeft aria-hidden="true" />
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
              src={imagenActual.src}
              alt={
                producto.nombre
                + ' — '
                + imagenActual.nombre
              }
            />

            {imagenes.length > 1 && (
              <>
                <button
                  type="button"
                  className="detalle-flecha detalle-flecha-izquierda"
                  onClick={() => cambiarImagen(-1)}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="detalle-flecha detalle-flecha-derecha"
                  onClick={() => cambiarImagen(1)}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          {imagenes.length > 1 && (
            <div
              className="detalle-miniaturas"
              aria-label="Elegir vista del producto"
            >
              {imagenes.map((imagen, indice) => (
                <button
                  key={imagen.src + indice}
                  type="button"
                  className={
                    imagenActiva === indice
                      ? 'detalle-miniatura detalle-miniatura-activa'
                      : 'detalle-miniatura'
                  }
                  aria-label={'Mostrar ' + imagen.nombre}
                  aria-pressed={imagenActiva === indice}
                  onClick={() => setImagenActiva(indice)}
                >
                  <img
                    src={imagen.src}
                    alt=""
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          <p className="detalle-imagen-nota">
            {imagenActual.nombre} · THE BIG FOOT
          </p>
        </section>

        <section className="detalle-info">
          <p className="detalle-categoria">
            {producto.categoria}
          </p>
          <h1>{producto.nombre}</h1>

          {producto.subtitulo && (
            <p className="detalle-subtitulo">
              {producto.subtitulo}
            </p>
          )}

          <p className="detalle-precio">
            {formatoPrecio(producto.precio)}
          </p>

          <p className="detalle-descripcion">
            {producto.descripcion
              || 'Modelo de la colección The Big Foot.'}
          </p>

          <AddToCart sku={producto.sku} />

          <div className="detalle-acordeon">
            <details open>
              <summary>Descripción del producto</summary>
              <p>
                {producto.descripcionCompleta
                  || producto.descripcion
                  || 'Producto The Big Foot.'}
              </p>
            </details>
          </div>
        </section>
      </main>
    </div>
  )
}


export default function ProductoDinamico() {
  const { sku } = useParams()

  return (
    <ProductoDinamicoContenido
      key={sku}
      sku={sku}
    />
  )
}
