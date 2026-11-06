import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import logo from '../assets/Logo_Web_transparente.png'
import './Comunidad.css'

function Comunidad() {
  return (
    <div className="comunidad-pagina">
      <nav className="comunidad-navegacion" aria-label="Navegación de comunidad">
        <Link to="/" className="comunidad-logo" aria-label="Ir al inicio">
          <img src={logo} alt="The Big Foot" />
        </Link>

        <Link to="/" className="comunidad-volver">
          <ArrowLeft size={20} strokeWidth={1.9} />
          <span>Volver al inicio</span>
        </Link>
      </nav>

      <header className="comunidad-encabezado">
        <div className="comunidad-encabezado-contenido">
          <p className="comunidad-etiqueta">La voz de la comunidad</p>
          <h1>Hablemos de zapatillas.</h1>
          <p className="comunidad-introduccion">
            Opiniones, preguntas y experiencias reales sobre los modelos de
            The Big Foot.
          </p>
        </div>
      </header>
    </div>
  )
}

export default Comunidad
