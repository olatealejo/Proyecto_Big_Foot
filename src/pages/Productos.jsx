import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import zapatilla1 from '../assets/The-Big-Foot-ChorizoParmezano1.jpeg'
import molino1 from '../assets/molino-1-lateral-izquierda.webp'
import './Productos.css'

function Productos() {
  return (
    <div className="productos-pagina">
      <nav className="productos-navegacion">
        <Link to="/" className="productos-volver">
          <ArrowLeft size={21} />
          <span>Volver al inicio</span>
        </Link>
      </nav>

      <main className="productos">
        <section className="productos-presentacion">
          <h1>Productos</h1>
          <p>Conocé nuestras zapatillas y encontrá tu próximo par.</p>
        </section>

        <section className="productos-lista">
          <article className="producto">
            <Link
              to="/productos/chorizo-parmesano"
              className="producto-enlace"
              aria-label="Ver Big Foot Chorizo Parmesano"
            >
              <img
                src={zapatilla1}
                alt="Zapatilla The Big Foot Chorizo Parmesano"
              />
              <h2>Big Foot Chorizo Parmesano</h2>
            </Link>
            <p>$80.000</p>
            <Link to="/productos/chorizo-parmesano" className="producto-boton">
              Ver producto
            </Link>
          </article>

          <article className="producto">
            <Link to="/productos/molino-1" className="producto-enlace" aria-label="Ver Big Foot Molino 1">
              <img src={molino1} alt="Zapatilla Big Foot Molino 1, negra y blanca" />
              <h2>Big Foot Molino 1</h2>
            </Link>
            <p>Precio a confirmar</p>
            <Link to="/productos/molino-1" className="producto-boton">
              Ver producto
            </Link>
          </article>

          <article className="producto producto-proximamente">
            <div className="producto-imagen-vacia">
              <span>Próximamente</span>
            </div>
            <h2>Nuevo modelo</h2>
            <p className="producto-texto-proximamente">Espacio para tu próxima zapatilla</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Productos
