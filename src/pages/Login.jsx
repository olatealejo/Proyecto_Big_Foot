import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import BrandLogo from '../components/BrandLogo'
import loginGif from '../assets/video-login.gif'
import {
  iniciarSesion,
  obtenerMensajeErrorAuth,
} from '../services/authService'
import './Login.css'

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
