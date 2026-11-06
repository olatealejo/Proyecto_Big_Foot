import { Link } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import logo from '../assets/Logo_BigFoot_Naranja_Header.png'
import CartTrigger from './CartTrigger'
import './Navbar.css'

// Barra de navegación compartida por Inicio y Contacto.
export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <Link to="/" className="navbar-logo" aria-label="Ir al inicio">
        <img src={logo} alt="The Big Foot" />
      </Link>

      <div className="navbar-menu">
        <Link to="/productos">Modelos</Link>
        <Link to="/personalizar">Personalizar</Link>
        <Link to="/comunidad">Comunidad</Link>
      </div>

      <div className="navbar-iconos">
        <Link to="/login" aria-label="Iniciar sesión">
          <UserRound />
        </Link>
        <CartTrigger />
      </div>
    </nav>
  )
}
