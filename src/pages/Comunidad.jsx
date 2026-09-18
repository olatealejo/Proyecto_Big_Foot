import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import './Comunidad.css'

function Comunidad() {
  return (
    <>
      <header className="comunidad-header">
        <Link to="/" className="comunidad-volver">
          Volver al inicio
        </Link>
      </header>

      <main className="comunidad">
        <section className="comunidad-presentacion">
          <h1>Comunidad</h1>
          <p>
            Comparte tus diseños y descubre las creaciones de otros usuarios.
          </p>
        </section>

        <section className="comunidad-contenido">
          {/* Aquí se agregarán los formularios y publicaciones */}
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Comunidad