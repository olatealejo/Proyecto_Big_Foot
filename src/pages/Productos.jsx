import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react'
import CartTrigger from '../components/CartTrigger'
import { PRODUCTOS, formatoPrecio } from '../cart/catalogo'
import { filtrarProductos } from '../cart/filtros.js'
import './Productos.css'

const listaProductos = Object.values(PRODUCTOS)
const modelos = [...new Set(listaProductos.map((producto) => producto.modelo))]
const limitesPrecio = [...new Set(listaProductos.map((producto) => producto.precio))].sort((a, b) => a - b)

function Productos() {
  const [texto, setTexto] = useState('')
  const [modelo, setModelo] = useState('todos')
  const [precioMaximo, setPrecioMaximo] = useState('todos')
  const [orden, setOrden] = useState('destacados')

  const visibles = useMemo(
    () => filtrarProductos(listaProductos, { texto, modelo, precioMaximo, orden }),
    [texto, modelo, precioMaximo, orden]
  )

  const filtrosActivos = texto !== '' || modelo !== 'todos' || precioMaximo !== 'todos' || orden !== 'destacados'

  function limpiarFiltros() {
    setTexto('')
    setModelo('todos')
    setPrecioMaximo('todos')
    setOrden('destacados')
  }

  return (
    <div className="productos-pagina">
      <nav className="productos-navegacion">
        <Link to="/" className="productos-volver">
          <ArrowLeft size={21} />
          <span>Volver al inicio</span>
        </Link>
        <CartTrigger />
      </nav>

      <main className="productos">
        <section className="productos-presentacion">
          <h1>Productos</h1>
          <p>Conocé nuestras zapatillas y encontrá tu próximo par.</p>
        </section>

        <section className="productos-filtros" aria-label="Filtrar catálogo">
          <div className="productos-filtros-titulo">
            <SlidersHorizontal size={19} aria-hidden="true" />
            <h2>Encontrá tu modelo</h2>
          </div>
          <div className="productos-filtros-grid">
            <div className="productos-campo productos-campo-busqueda">
              <label htmlFor="buscar-modelo">Buscar zapatillas</label>
              <div className="productos-busqueda-wrap">
                <Search size={17} aria-hidden="true" />
                <input id="buscar-modelo" type="search" value={texto}
                  onChange={(evento) => setTexto(evento.target.value)}
                  placeholder="Nombre de la zapatilla" autoComplete="off" />
              </div>
            </div>
            <div className="productos-campo">
              <label htmlFor="filtro-modelo">Modelo</label>
              <select id="filtro-modelo" value={modelo}
                onChange={(evento) => setModelo(evento.target.value)}>
                <option value="todos">Todos los modelos</option>
                {modelos.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
              </select>
            </div>
            <div className="productos-campo">
              <label htmlFor="filtro-precio">Precio máximo</label>
              <select id="filtro-precio" value={precioMaximo}
                onChange={(evento) => setPrecioMaximo(evento.target.value)}>
                <option value="todos">Sin límite</option>
                {limitesPrecio.map((importe) => (
                  <option key={importe} value={String(importe)}>Hasta {formatoPrecio(importe)}</option>
                ))}
              </select>
            </div>
            <div className="productos-campo">
              <label htmlFor="filtro-orden">Ordenar</label>
              <select id="filtro-orden" value={orden}
                onChange={(evento) => setOrden(evento.target.value)}>
                <option value="destacados">Orden original</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="nombre">Nombre A–Z</option>
              </select>
            </div>
          </div>
          <div className="productos-filtros-pie">
            <p role="status" aria-live="polite">
              {visibles.length} {visibles.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}
            </p>
            {filtrosActivos && (
              <button type="button" className="productos-limpiar" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>
        </section>

        {visibles.length > 0 ? (
          <section className="productos-lista" aria-label="Zapatillas disponibles en el catálogo">
            {visibles.map((producto) => (
              <article className="producto" key={producto.sku}>
                <Link to={producto.ruta} className="producto-enlace"
                  aria-label={'Ver ' + producto.nombre}>
                  <img src={producto.imagen} alt={'Zapatilla ' + producto.nombre} />
                  <h2>{producto.nombre}</h2>
                </Link>
                <p>{formatoPrecio(producto.precio)}</p>
                <Link to={producto.ruta} className="producto-boton">Ver producto</Link>
              </article>
            ))}
          </section>
        ) : (
          <div className="productos-sin-resultados">
            <h2>No encontramos modelos con esos filtros</h2>
            <p>Probá con otro nombre, modelo o precio máximo.</p>
            <button type="button" className="producto-boton" onClick={limpiarFiltros}>
              Mostrar todos los productos
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Productos
