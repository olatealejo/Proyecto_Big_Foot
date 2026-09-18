import './Login.css'
import loginGif from '../assets/video-login.gif'

function Login() {
  return (
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
  )
}

export default Login