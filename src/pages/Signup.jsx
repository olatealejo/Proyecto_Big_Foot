import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from 'lucide-react'

import logo from '../assets/Logo_Web_transparente.png'
import './Signup.css'

function Signup() {
  const [errorContrasena, setErrorContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)

  function manejarRegistro(evento) {
    evento.preventDefault()

    const datos = new FormData(evento.currentTarget)
    const contrasena = datos.get('contrasena')
    const confirmarContrasena = datos.get('confirmarContrasena')

    if (contrasena !== confirmarContrasena) {
      setErrorContrasena('Las contraseñas no coinciden.')
      return
    }

    setErrorContrasena('')
  }

  return (
    <div className="signup-pagina">
      <nav className="signup-navegacion" aria-label="Navegación de registro">
        <Link to="/" className="signup-nav-logo" aria-label="Ir al inicio">
          <img src={logo} alt="The Big Foot" />
        </Link>

        <Link to="/" className="signup-volver">
          <ArrowLeft size={20} strokeWidth={1.9} />
          <span>Volver al inicio</span>
        </Link>
      </nav>

      <main className="signup">
        <section className="signup-presentacion">
          <div className="signup-marca">
            <p className="signup-etiqueta">The Big Foot</p>
            <h1>Dejá tu huella.</h1>
            <p className="signup-presentacion-texto">
              Creá tu cuenta para guardar tus modelos favoritos y acceder a una
              experiencia personalizada.
            </p>

            <ul className="signup-beneficios">
              <li>
                <Check size={19} strokeWidth={2.2} />
                Guardá tus zapatillas favoritas
              </li>
              <li>
                <Check size={19} strokeWidth={2.2} />
                Revisá el estado de tus pedidos
              </li>
              <li>
                <Check size={19} strokeWidth={2.2} />
                Recibí novedades de nuevos modelos
              </li>
            </ul>
          </div>
        </section>

        <section className="signup-formulario-contenedor">
          <div className="signup-formulario">
            <p className="signup-etiqueta">Nueva cuenta</p>
            <h2>Registrarse</h2>

            <p className="signup-descripcion">
              Completá tus datos para crear una cuenta.
            </p>

            <form onSubmit={manejarRegistro}>
              <div className="signup-campo">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="signup-campo">
                <label htmlFor="correo-registro">Correo electrónico</label>
                <input
                  id="correo-registro"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="signup-fila">
                <div className="signup-campo">
                  <label htmlFor="contrasena-registro">Contraseña</label>
                  <div className="signup-password">
                    <input
                      id="contrasena-registro"
                      name="contrasena"
                      type={mostrarContrasena ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      minLength={8}
                      onChange={() => setErrorContrasena('')}
                      required
                    />

                    <button
                      type="button"
                      className="signup-password-boton"
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      aria-label={
                        mostrarContrasena
                          ? 'Ocultar contraseñas'
                          : 'Mostrar contraseñas'
                      }
                      aria-pressed={mostrarContrasena}
                    >
                      {mostrarContrasena ? (
                        <EyeOff size={19} strokeWidth={1.9} />
                      ) : (
                        <Eye size={19} strokeWidth={1.9} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="signup-campo">
                  <label htmlFor="confirmar-contrasena">
                    Confirmar contraseña
                  </label>
                  <div className="signup-password">
                    <input
                      id="confirmar-contrasena"
                      name="confirmarContrasena"
                      type={mostrarContrasena ? 'text' : 'password'}
                      placeholder="Repetí tu contraseña"
                      autoComplete="new-password"
                      minLength={8}
                      onChange={() => setErrorContrasena('')}
                      aria-invalid={Boolean(errorContrasena)}
                      aria-describedby={
                        errorContrasena
                          ? 'error-confirmar-contrasena'
                          : undefined
                      }
                      required
                    />

                    <button
                      type="button"
                      className="signup-password-boton"
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      aria-label={
                        mostrarContrasena
                          ? 'Ocultar contraseñas'
                          : 'Mostrar contraseñas'
                      }
                      aria-pressed={mostrarContrasena}
                    >
                      {mostrarContrasena ? (
                        <EyeOff size={19} strokeWidth={1.9} />
                      ) : (
                        <Eye size={19} strokeWidth={1.9} />
                      )}
                    </button>
                  </div>

                  {errorContrasena && (
                    <p
                      id="error-confirmar-contrasena"
                      className="signup-error"
                      role="alert"
                    >
                      {errorContrasena}
                    </p>
                  )}
                </div>
              </div>

              <label className="signup-terminos">
                <input type="checkbox" name="terminos" required />
                <span>
                  Acepto los términos y la política de privacidad.
                </span>
              </label>

              <button type="submit" className="signup-boton">
                Crear cuenta
                <ArrowRight size={19} strokeWidth={2} />
              </button>
            </form>

            <div className="signup-login">
              <span>¿Ya tenés una cuenta?</span>
              <Link to="/login">Iniciar sesión</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Signup
