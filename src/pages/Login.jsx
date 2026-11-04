import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import logo from '../assets/Logo_Web.jpeg'
import loginGif from '../assets/video-login.gif'
import './Login.css'

function Login() {
  return (
    <div className="login-pagina">
      <nav className="login-navegacion" aria-label="Navegación de acceso">
        <Link to="/" className="login-nav-logo" aria-label="Ir al inicio">
          <img src={logo} alt="The Big Foot" />
        </Link>

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

            <form>
              <div className="login-campo">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
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
                />
              </div>

              <button type="button" className="login-boton">
                Ingresar
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
