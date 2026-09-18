import { Link } from 'react-router-dom'
import { UserRound, ShoppingCart, Search } from 'lucide-react'

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
          <button type="button" aria-label="Usuario">
            <UserRound size={25} strokeWidth={1.8} />
          </button>

          <button type="button" aria-label="Carrito">
            <ShoppingCart size={25} strokeWidth={1.8} />
          </button>

          <button type="button" aria-label="Buscar">
            <Search size={25} strokeWidth={1.8} />
          </button>
        </div>
      </nav>

      <main className="inicio"></main>
    </>
  )
}

export default Inicio