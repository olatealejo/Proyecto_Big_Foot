import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react'
import CartTrigger from '../components/CartTrigger'
import { PRODUCTOS, formatoPrecio } from '../cart/catalogo'
import { filtrarProductos } from '../cart/filtros.js'
import BrandLogo from '../components/BrandLogo'
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
      <nav className="productos-navegacion" aria-label="Navegación de modelos">
        <Link to="/" className="productos-volver">
          <ArrowLeft size={20} aria-hidden="true" />
          <span>Volver al inicio</span>
        </Link>
        <BrandLogo className="productos-logo" />
        <div className="productos-carrito"><CartTrigger /></div>
      </nav>

      <main className="productos">
        <header className="productos-presentacion">
          <p className="productos-eyebrow"><span aria-hidden="true" /> COLECCIÓN THE BIG FOOT</p>
          <h1>MODELOS <span>QUE DEJAN HUELLA.</span></h1>
          <p className="productos-bajada">Explorá nuestros diseños de básquet. Elegí el modelo que va con tu juego.</p>
          <div className="productos-presentacion-pie">
            <span>DISEÑADOS PARA DESTACAR</span>
            <span>{listaProductos.length} MODELOS EN EL CATÁLOGO</span>
          </div>
        </header>

        <section className="productos-filtros" aria-label="Filtrar catálogo">
          <div className="productos-filtros-encabezado">
            <div className="productos-filtros-titulo">
              <SlidersHorizontal size={19} aria-hidden="true" />
              <h2>ENCONTRÁ TU MODELO</h2>
            </div>
            <span>BUSCÁ, COMPARÁ Y ELEGÍ</span>
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
              <label htmlFor="filtro-orden">Ordenar por</label>
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
              <strong>{visibles.length}</strong> {visibles.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}
            </p>
            {filtrosActivos && (
              <button type="button" className="productos-limpiar" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>
        </section>

        {visibles.length > 0 ? (
          <section className="productos-lista" aria-label="Zapatillas del catálogo">
            {visibles.map((producto) => (
              <article className="producto" key={producto.sku}>
                <Link to={producto.ruta} className="producto-enlace"
                  aria-label={'Ver ' + producto.nombre}>
                  <div className="producto-foto">
                    <span className="producto-coleccion">THE BIG FOOT / BÁSQUET</span>
                    <img src={producto.imagen} alt={'Zapatilla ' + producto.nombre} />
                    <span className="producto-explorar" aria-hidden="true">
                      VER DETALLES <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="producto-datos">
                    <p className="producto-serie">COLECCIÓN DE CANCHA</p>
                    <h2>{producto.nombre}</h2>
                  </div>
                </Link>
                <div className="producto-pie">
                  <div className="producto-precio">
                    <span>PRECIO</span>
                    <strong>{formatoPrecio(producto.precio)}</strong>
                  </div>
                  <Link to={producto.ruta} className="producto-boton" aria-label={'Explorar ' + producto.nombre}>
                    <span>VER MODELO</span>
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="productos-sin-resultados">
            <Search size={32} aria-hidden="true" />
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