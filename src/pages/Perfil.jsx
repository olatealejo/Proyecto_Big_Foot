import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Navigate } from 'react-router-dom'
import {
  Camera,
  KeyRound,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import {
  cambiarContrasena,
  guardarPerfil,
  obtenerMensajeErrorPerfil,
  procesarFotoPerfil,
} from '../services/perfilService'
import './Perfil.css'

const datosIniciales = {
  nombre: '',
  telefono: '',
  ubicacion: '',
  bio: '',
}

const contrasenasIniciales = {
  actual: '',
  nueva: '',
  confirmacion: '',
}

function Perfil() {
  const {
    usuario,
    perfil,
    esAdmin,
    cargando,
    actualizarPerfilLocal,
  } = useAuth()

  const [datos, setDatos] = useState(datosIniciales)
  const [archivoFoto, setArchivoFoto] = useState(null)
  const [vistaPrevia, setVistaPrevia] = useState('')
  const [versionInputFoto, setVersionInputFoto] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const [contrasenas, setContrasenas] =
    useState(contrasenasIniciales)
  const [cambiandoContrasena, setCambiandoContrasena] =
    useState(false)
  const [mensajeContrasena, setMensajeContrasena] =
    useState('')
  const [errorContrasena, setErrorContrasena] =
    useState('')

  useEffect(() => {
    if (!usuario) {
      return
    }

    setDatos({
      nombre:
        perfil?.nombre
        || usuario.displayName
        || '',
      telefono: perfil?.telefono || '',
      ubicacion: perfil?.ubicacion || '',
      bio: perfil?.bio || '',
    })
  }, [usuario, perfil])

  useEffect(() => {
    if (!archivoFoto) {
      setVistaPrevia('')
      return undefined
    }

    const urlTemporal = URL.createObjectURL(archivoFoto)
    setVistaPrevia(urlTemporal)

    return () => {
      URL.revokeObjectURL(urlTemporal)
    }
  }, [archivoFoto])

  const usaContrasena = useMemo(
    () =>
      usuario?.providerData?.some(
        (proveedor) => proveedor.providerId === 'password',
      ) || false,
    [usuario],
  )

  if (cargando) {
    return (
      <div className="perfil-pagina">
        <Navbar />
        <main className="perfil-cargando">
          Cargando perfil...
        </main>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  const fotoActual =
    vistaPrevia
    || perfil?.fotoURL
    || usuario.photoURL
    || ''

  const iniciales = (
    datos.nombre
    || usuario.email
    || 'U'
  )
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()

  const manejarCambio = (evento) => {
    const { name, value } = evento.target

    setDatos((actuales) => ({
      ...actuales,
      [name]: value,
    }))
    setError('')
    setMensaje('')
  }

  const seleccionarFoto = (evento) => {
    const archivo = evento.target.files?.[0]

    setError('')
    setMensaje('')

    if (!archivo) {
      setArchivoFoto(null)
      return
    }

    if (!archivo.type.startsWith('image/')) {
      setError('Seleccioná un archivo de imagen válido.')
      setArchivoFoto(null)
      return
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5 MB.')
      setArchivoFoto(null)
      return
    }

    setArchivoFoto(archivo)
  }

  const guardarDatos = async (evento) => {
    evento.preventDefault()

    const nombre = datos.nombre.trim()

    if (nombre.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.')
      return
    }

    try {
      setGuardando(true)
      setError('')
      setMensaje('')

      let fotoURL =
        perfil?.fotoURL
        || usuario.photoURL
        || ''

      if (archivoFoto) {
        fotoURL = await procesarFotoPerfil(archivoFoto)
      }

      const datosActualizados = {
        nombre,
        telefono: datos.telefono.trim(),
        ubicacion: datos.ubicacion.trim(),
        bio: datos.bio.trim(),
        fotoURL,
      }

      await guardarPerfil(usuario, datosActualizados)
      actualizarPerfilLocal(datosActualizados)


      setArchivoFoto(null)
      setVersionInputFoto((version) => version + 1)
      setMensaje('El perfil se actualizó correctamente.')
    } catch (err) {
      console.error('Error al guardar el perfil:', err)


      setError(obtenerMensajeErrorPerfil(err))
    } finally {
      setGuardando(false)
    }
  }

  const manejarCambioContrasena = (evento) => {
    const { name, value } = evento.target

    setContrasenas((actuales) => ({
      ...actuales,
      [name]: value,
    }))
    setErrorContrasena('')
    setMensajeContrasena('')
  }

  const guardarContrasena = async (evento) => {
    evento.preventDefault()

    if (!contrasenas.actual) {
      setErrorContrasena(
        'Ingresá tu contraseña actual.',
      )
      return
    }

    if (contrasenas.nueva.length < 8) {
      setErrorContrasena(
        'La nueva contraseña debe tener al menos 8 caracteres.',
      )
      return
    }

    if (
      contrasenas.nueva
      !== contrasenas.confirmacion
    ) {
      setErrorContrasena(
        'Las contraseñas nuevas no coinciden.',
      )
      return
    }

    try {
      setCambiandoContrasena(true)
      setErrorContrasena('')
      setMensajeContrasena('')

      await cambiarContrasena({
        usuario,
        contrasenaActual: contrasenas.actual,
        contrasenaNueva: contrasenas.nueva,
      })

      setContrasenas(contrasenasIniciales)
      setMensajeContrasena(
        'La contraseña se actualizó correctamente.',
      )
    } catch (err) {
      console.error(
        'Error al cambiar la contraseña:',
        err,
      )
      setErrorContrasena(
        obtenerMensajeErrorPerfil(err),
      )
    } finally {
      setCambiandoContrasena(false)
    }
  }

  return (
    <div className="perfil-pagina">
      <Navbar />

      <header className="perfil-encabezado">
        <div>
          <p className="perfil-etiqueta">Tu cuenta</p>
          <h1>Perfil personal.</h1>
          <p>
            Administrá tu identidad y los datos visibles en
            The Big Foot.
          </p>
        </div>
      </header>

      <main className="perfil-contenido">
        <aside className="perfil-resumen">
          <div className="perfil-avatar-grande">
            {fotoActual ? (
              <img
                src={fotoActual}
                alt={`Foto de ${datos.nombre || 'usuario'}`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{iniciales}</span>
            )}
          </div>

          <h2>{datos.nombre || 'Usuario'}</h2>
          <p>{usuario.email}</p>

          <span className="perfil-rol">
            <ShieldCheck aria-hidden="true" />
            {esAdmin
              ? 'Administrador'
              : 'Usuario registrado'}
          </span>
        </aside>

        <div className="perfil-secciones">
          <section className="perfil-panel">
            <div className="perfil-panel-encabezado">
              <div>
                <p className="perfil-etiqueta">
                  Información personal
                </p>
                <h2>Editar perfil</h2>
              </div>
              <UserRound aria-hidden="true" />
            </div>

            <form
              className="perfil-formulario"
              onSubmit={guardarDatos}
            >
              <div className="perfil-foto-editor">
                <div className="perfil-foto-miniatura">
                  {fotoActual ? (
                    <img
                      src={fotoActual}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{iniciales}</span>
                  )}
                </div>

                <div>
                  <label
                    className="perfil-subir-foto"
                    htmlFor="foto-perfil"
                  >
                    <Camera aria-hidden="true" />
                    Elegir foto
                  </label>
                  <input
                    key={versionInputFoto}
                    id="foto-perfil"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={seleccionarFoto}
                  />
                  <p>
                    JPG, PNG o WEBP. Se reduce automáticamente.
                  </p>
                </div>
              </div>

              <div className="perfil-campos-dobles">
                <label>
                  Nombre
                  <input
                    type="text"
                    name="nombre"
                    value={datos.nombre}
                    onChange={manejarCambio}
                    maxLength="60"
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  Correo electrónico
                  <input
                    type="email"
                    value={usuario.email || ''}
                    disabled
                  />
                </label>
              </div>

              <div className="perfil-campos-dobles">
                <label>
                  <span className="perfil-label-con-icono">
                    <Phone aria-hidden="true" />
                    Teléfono
                  </span>
                  <input
                    type="tel"
                    name="telefono"
                    value={datos.telefono}
                    onChange={manejarCambio}
                    maxLength="30"
                    autoComplete="tel"
                    placeholder="Ejemplo: 299 123 4567"
                  />
                </label>

                <label>
                  <span className="perfil-label-con-icono">
                    <MapPin aria-hidden="true" />
                    Ubicación
                  </span>
                  <input
                    type="text"
                    name="ubicacion"
                    value={datos.ubicacion}
                    onChange={manejarCambio}
                    maxLength="80"
                    placeholder="Ciudad, provincia"
                  />
                </label>
              </div>

              <label>
                Biografía
                <textarea
                  name="bio"
                  value={datos.bio}
                  onChange={manejarCambio}
                  rows="4"
                  maxLength="240"
                  placeholder="Contá brevemente algo sobre vos"
                />
                <span className="perfil-contador">
                  {datos.bio.length} / 240
                </span>
              </label>

              {error && (
                <p className="perfil-mensaje perfil-error" role="alert">
                  {error}
                </p>
              )}

              {mensaje && (
                <p className="perfil-mensaje perfil-exito" role="status">
                  {mensaje}
                </p>
              )}

              <button
                type="submit"
                className="perfil-guardar"
                disabled={guardando}
              >
                <Save aria-hidden="true" />
                {guardando
                  ? 'Guardando...'
                  : 'Guardar cambios'}
              </button>
            </form>
          </section>

          <section className="perfil-panel">
            <div className="perfil-panel-encabezado">
              <div>
                <p className="perfil-etiqueta">
                  Seguridad
                </p>
                <h2>Contraseña</h2>
              </div>
              <KeyRound aria-hidden="true" />
            </div>

            {usaContrasena ? (
              <form
                className="perfil-formulario"
                onSubmit={guardarContrasena}
              >
                <label>
                  Contraseña actual
                  <input
                    type="password"
                    name="actual"
                    value={contrasenas.actual}
                    onChange={manejarCambioContrasena}
                    autoComplete="current-password"
                    required
                  />
                </label>

                <div className="perfil-campos-dobles">
                  <label>
                    Nueva contraseña
                    <input
                      type="password"
                      name="nueva"
                      value={contrasenas.nueva}
                      onChange={manejarCambioContrasena}
                      autoComplete="new-password"
                      minLength="8"
                      required
                    />
                  </label>

                  <label>
                    Confirmar contraseña
                    <input
                      type="password"
                      name="confirmacion"
                      value={contrasenas.confirmacion}
                      onChange={manejarCambioContrasena}
                      autoComplete="new-password"
                      minLength="8"
                      required
                    />
                  </label>
                </div>

                {errorContrasena && (
                  <p
                    className="perfil-mensaje perfil-error"
                    role="alert"
                  >
                    {errorContrasena}
                  </p>
                )}

                {mensajeContrasena && (
                  <p
                    className="perfil-mensaje perfil-exito"
                    role="status"
                  >
                    {mensajeContrasena}
                  </p>
                )}

                <button
                  type="submit"
                  className="perfil-guardar"
                  disabled={cambiandoContrasena}
                >
                  <KeyRound aria-hidden="true" />
                  {cambiandoContrasena
                    ? 'Actualizando...'
                    : 'Cambiar contraseña'}
                </button>
              </form>
            ) : (
              <div className="perfil-aviso-google">
                <ShieldCheck aria-hidden="true" />
                <div>
                  <strong>Cuenta vinculada con Google</strong>
                  <p>
                    La contraseña de esta cuenta se administra
                    desde la configuración de Google.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Perfil
