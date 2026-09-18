import { Link } from 'react-router-dom'
import logo from '../assets/Logo_Web.jpeg'
import './Inicio.css'

function Inicio() {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="The Big Foot" />
        </Link>
        <div className="navbar-menu">
          <Link to="/productos">Modelos</Link>
          <Link to="/nosotros">Confección</Link>
          <Link to="/">Menú</Link>
          <Link to="/contacto">Plantillas</Link>
        </div>

        <div className="navbar-iconos">
          <button aria-label="Usuario">●</button>
          <button aria-label="Carrito">▱</button>
          <button aria-label="Buscar">⌕</button>
        </div>
      </nav>

      <main className="inicio"></main>
    </>
  )
}

export default Inicio