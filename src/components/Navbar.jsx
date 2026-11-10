import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import {
  LogOut,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { cerrarSesion } from '../services/authService'
import BrandLogo from './BrandLogo'
import CartTrigger from './CartTrigger'
import './Navbar.css'

// Barra de navegación compartida por las páginas principales.
export default function Navbar() {
  const { usuario, perfil, esAdmin } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [cerrandoSesion, setCerrandoSesion] = useState(false)
  const [errorSesion, setErrorSesion] = useState('')
  const cuentaRef = useRef(null)

  useEffect(() => {
    if (!menuAbierto) {
      return undefined
    }

    const cerrarFueraDelMenu = (evento) => {
      if (
        cuentaRef.current
        && !cuentaRef.current.contains(evento.target)
      ) {
        setMenuAbierto(false)
      }
    }

    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') {
        setMenuAbierto(false)
      }
    }

    document.addEventListener('pointerdown', cerrarFueraDelMenu)
    document.addEventListener('keydown', cerrarConEscape)

    return () => {
      document.removeEventListener(
        'pointerdown',
        cerrarFueraDelMenu,
      )
      document.removeEventListener(
        'keydown',
        cerrarConEscape,
      )
    }
  }, [menuAbierto])

  const manejarCierreSesion = async () => {
    try {
      setCerrandoSesion(true)
      setErrorSesion('')
      await cerrarSesion()
      setMenuAbierto(false)
    } catch (error) {
      console.error('No se pudo cerrar la sesión:', error)
      setErrorSesion('No se pudo cerrar la sesión.')
    } finally {
      setCerrandoSesion(false)
    }
  }

  const nombreUsuario =
    perfil?.nombre
    || usuario?.displayName
    || usuario?.email
    || 'Usuario'

  const fotoUsuario =
    perfil?.fotoURL
    || usuario?.photoURL
    || ''

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <BrandLogo />

      <div className="navbar-menu">
        <Link to="/productos">Modelos</Link>
        <Link to="/comunidad">Comunidad</Link>
      </div>

      <div className="navbar-iconos">
        {esAdmin && (
          <span
            className="navbar-admin"
            title="Cuenta administradora"
          >
            Admin
          </span>
        )}

        {usuario ? (
          <div className="navbar-cuenta" ref={cuentaRef}>
            <button
              type="button"
              className="navbar-cuenta-boton"
              aria-label={`Abrir menú de ${nombreUsuario}`}
              aria-expanded={menuAbierto}
              aria-haspopup="menu"
              onClick={() => {
                setMenuAbierto((abierto) => !abierto)
                setErrorSesion('')
              }}
            >
              {fotoUsuario ? (
                <img
                  src={fotoUsuario}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserRound />
              )}
            </button>

            {menuAbierto && (
              <section
                className="navbar-cuenta-menu"
                role="menu"
                aria-label="Opciones de la cuenta"
              >
                <div className="navbar-cuenta-identidad">
                  <div className="navbar-cuenta-foto">
                    {fotoUsuario ? (
                      <img
                        src={fotoUsuario}
                        alt={`Foto de ${nombreUsuario}`}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserRound aria-hidden="true" />
                    )}
                  </div>

                  <div>
                    <strong>{nombreUsuario}</strong>
                    <span>{usuario.email}</span>
                  </div>
                </div>

                <div className="navbar-cuenta-datos">
                  <span>
                    <ShieldCheck aria-hidden="true" />
                    {esAdmin
                      ? 'Administrador'
                      : 'Usuario registrado'}
                  </span>
                  <span className="navbar-sesion-activa">
                    Sesión activa
                  </span>
                </div>

                {errorSesion && (
                  <p className="navbar-cuenta-error" role="alert">
                    {errorSesion}
                  </p>
                )}

                <button
                  type="button"
                  className="navbar-cerrar-sesion"
                  role="menuitem"
                  onClick={manejarCierreSesion}
                  disabled={cerrandoSesion}
                >
                  <LogOut aria-hidden="true" />
                  {cerrandoSesion
                    ? 'Cerrando sesión...'
                    : 'Cerrar sesión'}
                </button>
              </section>
            )}
          </div>
        ) : (
          <Link to="/login" aria-label="Iniciar sesión">
            <UserRound />
          </Link>
        )}

        <CartTrigger />
      </div>
    </nav>
  )
}
