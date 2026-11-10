import { Link } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import BrandLogo from './BrandLogo'
import CartTrigger from './CartTrigger'
import './Navbar.css'

// Barra de navegación compartida por Inicio y Contacto.
export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <BrandLogo />

      <div className="navbar-menu">
        <Link to="/productos">Modelos</Link>
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
