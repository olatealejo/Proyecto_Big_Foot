import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import zapatilla1 from '../assets/The-Big-Foot-ChorizoParmezano1.jpeg'
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

            <Link
              to="/productos/chorizo-parmesano"
              className="producto-boton"
            >
              Ver producto
            </Link>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Productos
