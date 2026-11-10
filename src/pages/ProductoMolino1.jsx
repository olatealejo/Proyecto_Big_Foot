import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartTrigger from '../components/CartTrigger'
import BrandLogo from '../components/BrandLogo'
import AddToCart from '../components/AddToCart'
import { useCatalog } from '../catalogo/useCatalog'
import { formatoPrecio } from '../cart/catalogo'
import ProductoNoDisponible from './ProductoNoDisponible'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

import lateralIzquierda from '../assets/molino-1-lateral-izquierda.png'
import lateralDerecha from '../assets/molino-1-lateral-derecha.png'
import diagonal from '../assets/molino-1-diagonal.png'
import superior from '../assets/molino-1-superior.png'
import trasera from '../assets/molino-1-trasera.png'
import suela from '../assets/molino-1-suela.png'
import './ProductoDetalle.css'
import './ProductoDetalle.galeria.css'

const imagenes = [
  { src: lateralIzquierda, nombre: 'Lateral izquierda' },
  { src: lateralDerecha, nombre: 'Lateral derecha' },
  { src: diagonal, nombre: 'Vista diagonal' },
  { src: superior, nombre: 'Vista superior' },
  { src: trasera, nombre: 'Vista trasera' },
  { src: suela, nombre: 'Suela' },
]

function ProductoMolino1() {
  const [imagenActiva, setImagenActiva] = useState(0)
  const { productos, cargando } = useCatalog()
  const producto = productos['molino-1']
  const cambiarImagen = (direccion) => {
    setImagenActiva((indice) => (indice + direccion + imagenes.length) % imagenes.length)
  }

  if (cargando) return <main className="detalle-pagina"><p>Cargando producto...</p></main>
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
        <section className="detalle-galeria" aria-label="Imágenes de Big Foot Molino 1">
          <div className="detalle-imagen-principal">
            <img src={imagenActiva === 0 ? producto.imagen : imagenes[imagenActiva].src} alt={`Big Foot Molino 1 — ${imagenes[imagenActiva].nombre}`} />
            <button type="button" className="detalle-flecha detalle-flecha-izquierda" onClick={() => cambiarImagen(-1)} aria-label="Imagen anterior">
              <ChevronLeft size={24} />
            </button>
            <button type="button" className="detalle-flecha detalle-flecha-derecha" onClick={() => cambiarImagen(1)} aria-label="Imagen siguiente">
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="detalle-miniaturas molino-miniaturas" aria-label="Elegir vista de Molino 1">
            {imagenes.map((imagen, indice) => (
              <button
                key={imagen.nombre}
                type="button"
                className={`detalle-miniatura${imagenActiva === indice ? ' detalle-miniatura-activa' : ''}`}
                aria-label={`Mostrar ${imagen.nombre.toLowerCase()}`}
                aria-pressed={imagenActiva === indice}
                onClick={() => setImagenActiva(indice)}
              >
                <img src={indice === 0 ? producto.imagen : imagen.src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <p className="detalle-imagen-nota">{imagenes[imagenActiva].nombre} · THE BIG FOOT</p>
        </section>

        <section className="detalle-info">
          <p className="detalle-categoria">ZAPATILLAS / MOLINO 1</p>
          <h1>{producto.nombre}</h1>
          <p className="detalle-subtitulo">Diseño en negro y blanco con identidad propia.</p>
          <p className="detalle-precio">{formatoPrecio(producto.precio)}</p>
          <p className="detalle-descripcion">{producto.descripcion || "Modelo The Big Foot."}</p>
          <AddToCart sku="molino-1" />
          <div className="detalle-acordeon">
            <details>
              <summary>Descripción del producto</summary>
              <p>Big Foot Molino 1, modelo negro y blanco. Galería de seis fotografías.</p>
            </details>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ProductoMolino1