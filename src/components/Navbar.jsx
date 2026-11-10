import { Link } from 'react-router-dom'
import { UserRound } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'
import CartTrigger from './CartTrigger'
import './Navbar.css'

// Barra de navegación compartida por Inicio y Contacto.
export default function Navbar() {
  const { usuario, esAdmin } = useAuth()

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <BrandLogo />

      <div className="navbar-menu">
        <Link to="/productos">Modelos</Link>
        <Link to="/comunidad">Comunidad</Link>
      </div>

      <div className="navbar-iconos">
        {esAdmin && (
          <span className="navbar-admin" title="Cuenta administradora">
            Admin
          </span>
        )}

        <Link
          to="/login"
          aria-label={
            usuario
              ? `Cuenta de ${usuario.displayName || usuario.email}`
              : 'Iniciar sesión'
          }
        >
          <UserRound />
        </Link>

        <CartTrigger />
      </div>
    </nav>
  )
}
