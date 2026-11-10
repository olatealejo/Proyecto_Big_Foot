import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import BrandLogo from '../components/BrandLogo'
import loginGif from '../assets/video-login.gif'
import {
  iniciarSesion,
  iniciarSesionConGoogle, // <-- Importado
  obtenerMensajeErrorAuth,
} from '../services/authService'
import './Login.css'

function GoogleIcon() {
  return (
    <svg
      className="login-google-icono"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      <path
        fill="#4285f4"
        d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.715v2.258h2.909c1.702-1.567 2.684-3.875 2.684-6.613Z"
      />
      <path
        fill="#34a853"
        d="M9 18c2.43 0 4.468-.806 5.956-2.182l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.328-1.585-5.037-3.715H.956v2.332A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#fbbc05"
        d="M3.963 10.704A5.41 5.41 0 0 1 3.682 9c0-.592.102-1.168.281-1.704V4.964H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.036l3.007-2.332Z"
      />
      <path
        fill="#ea4335"
        d="M9 3.58c1.321 0 2.507.454 3.441 1.346l2.581-2.581C13.464.892 11.426 0 9 0A9 9 0 0 0 .956 4.964l3.007 2.332C4.672 5.166 6.656 3.58 9 3.58Z"
      />
    </svg>
  )
}

function Login() {
  const navigate = useNavigate()
  const [errorIngreso, setErrorIngreso] = useState('')
  const [ingresando, setIngresando] = useState(false)

  async function manejarIngreso(evento) {
    evento.preventDefault()

    const datos = new FormData(evento.currentTarget)
    const correo = datos.get('correo').trim()
    const contrasena = datos.get('contrasena')

    try {
      setIngresando(true)
      setErrorIngreso('')

      await iniciarSesion({
        correo,
        contrasena,
      })

      navigate('/comunidad')
    } catch (error) {
      setErrorIngreso(obtenerMensajeErrorAuth(error))
    } finally {
      setIngresando(false)
    }
  }

  // Manejador para iniciar sesión con Google
  async function manejarIngresoGoogle() {
    try {
      setIngresando(true)
      setErrorIngreso('')

      await iniciarSesionConGoogle()

      navigate('/comunidad')
    } catch (error) {
      setErrorIngreso(obtenerMensajeErrorAuth(error))
    } finally {
      setIngresando(false)
    }
  }

  return (
    <div className="login-pagina">
      <nav className="login-navegacion" aria-label="Navegación de acceso">
        <BrandLogo />

        <Link to="/" className="login-volver">
          <ArrowLeft size={20} strokeWidth={1.9} />
          <span>Volver al inicio</span>
        </Link>
      </nav>

      <main className="login">
        <section className="login-video" aria-label="Presentación de la marca">
          <div className="login-video-marco">
            <img
              className="login-gif"
              src={loginGif}
              alt="Presentación de The Big Foot"
            />

            <div className="login-video-texto">
              <p>The Big Foot</p>
              <h2>Volvé a la cancha.</h2>
            </div>
          </div>
        </section>

        <section className="login-formulario-contenedor">
          <div className="login-formulario">
            <p className="login-etiqueta">Tu cuenta</p>
            <h1>Iniciar sesión</h1>

            <p className="login-descripcion">
              Ingresá para guardar tus modelos, revisar tus pedidos y seguir
              dejando tu huella.
            </p>

            <form onSubmit={manejarIngreso}>
              <div className="login-campo">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="login-campo">
                <label htmlFor="contrasena">Contraseña</label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  placeholder="Ingresá tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>

              {errorIngreso && (
                <p className="login-error" role="alert">
                  {errorIngreso}
                </p>
              )}

              <button
                type="submit"
                className="login-boton"
                disabled={ingresando}
              >
                {ingresando ? 'Ingresando...' : 'Ingresar'}
                <ArrowRight size={19} strokeWidth={2} />
              </button>
            </form>

            <div className="login-separador" aria-hidden="true">
              <span>o bien</span>
            </div>

            <button
              type="button"
              className="login-boton login-boton-google"
              onClick={manejarIngresoGoogle}
              disabled={ingresando}
            >
              <GoogleIcon />
              <span>
                {ingresando ? 'Ingresando...' : 'Ingresar con Google'}
              </span>
            </button>

            <div className="login-registro">
              <span>¿No tenés una cuenta?</span>
              <Link to="/registro">Crear una cuenta</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Login
