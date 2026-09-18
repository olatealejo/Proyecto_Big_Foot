import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import logo from '../assets/Logo_Web.jpeg'
import loginGif from '../assets/video-login.gif'
import './Login.css'

function Login() {
  return (
    <div className="login-pagina">
      <nav className="login-navegacion">
        <Link to="/" className="login-nav-logo">
          <img src={logo} alt="The Big Foot" />
        </Link>

        <Link to="/" className="login-volver">
          <ArrowLeft size={21} strokeWidth={2} />
          <span>Volver al inicio</span>
        </Link>
      </nav>

      <main className="login">
        <section className="login-video">
          <img
            className="login-gif"
            src={loginGif}
            alt="Presentación de The Big Foot"
          />
        </section>

        <section className="login-formulario-contenedor">
          <div className="login-formulario">
            <h1>Iniciar sesión</h1>

            <p className="login-descripcion">
              Ingresá a tu cuenta de The Big Foot.
            </p>

            <form>
              <div className="login-campo">
                <label htmlFor="correo">Correo electrónico</label>

                <input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="login-campo">
                <label htmlFor="contrasena">Contraseña</label>

                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  placeholder="Ingresá tu contraseña"
                />
              </div>

              <button type="button" className="login-boton">
                Ingresar
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Login