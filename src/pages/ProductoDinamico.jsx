import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCatalog } from '../catalogo/useCatalog'
import { formatoPrecio } from '../cart/catalogo'
import BrandLogo from '../components/BrandLogo'
import CartTrigger from '../components/CartTrigger'
import AddToCart from '../components/AddToCart'
import ProductoNoDisponible from './ProductoNoDisponible'
import './ProductoDetalle.css'
import './ProductoDetalle.galeria.css'

export default function ProductoDinamico() {
  const { sku } = useParams()
  const { productos, cargando } = useCatalog()
  const producto = productos[sku]

  if (cargando) return <main className="detalle-pagina"><p>Cargando producto...</p></main>
  if (!producto) return <ProductoNoDisponible />

  return (
    <div className="detalle-pagina">
      <nav className="detalle-nav">
        <Link to="/productos" className="detalle-volver"><ArrowLeft size={20} /> Volver a productos</Link>
        <BrandLogo className="detalle-logo" />
        <CartTrigger />
      </nav>
      <main className="detalle-contenido">
        <section className="detalle-galeria">
          <div className="detalle-imagen-principal">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>
          <p className="detalle-imagen-nota">THE BIG FOOT · NUEVO MODELO</p>
        </section>
        <section className="detalle-info">
          <p className="detalle-categoria">ZAPATILLAS / {producto.modelo}</p>
          <h1>{producto.nombre}</h1>
          <p className="detalle-precio">{formatoPrecio(producto.precio)}</p>
          <p className="detalle-descripcion">{producto.descripcion || 'Modelo de la colección The Big Foot.'}</p>
          <AddToCart sku={producto.sku} />
        </section>
      </main>
    </div>
  )
}
