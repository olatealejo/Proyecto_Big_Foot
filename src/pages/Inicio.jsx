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
          <Link to="/catalogo">Modelos</Link>
          <Link to="/personalizar">Personalizar</Link>
          <Link to="/comunidad">Comunidad</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="navbar-iconos">
          <Link to="/login" aria-label="Iniciar sesión">
            <UserRound size={25} strokeWidth={1.8} />
          </Link>

          <Link to="/carrito" aria-label="Carrito">
            <ShoppingCart size={25} strokeWidth={1.8} />
          </Link>

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