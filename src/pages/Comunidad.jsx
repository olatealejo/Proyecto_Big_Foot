import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Pencil,
  Plus,
  Star,
  Trash2,
  TrendingUp,
} from 'lucide-react'

import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import {
  actualizarPublicacion,
  crearPublicacion,
  eliminarPublicacionConJustificacion,
  obtenerPublicaciones,
} from '../services/publicacionesService'
import './Comunidad.css'

const formularioInicial = {
  tipo: 'Reseña',
  modelo: 'Chorizo Parmesano',
  modeloSecundario: 'Molino 1',
  calificacion: 0,
  titulo: '',
  resumen: '',
}

const nombresTipo = {
  resena: 'Reseña',
  pregunta: 'Pregunta',
  comparacion: 'Comparación',
}

const tiposFirebase = {
  Reseña: 'resena',
  Pregunta: 'pregunta',
  Comparación: 'comparacion',
}

function adaptarPublicacion(documento) {
  const autor = documento.autor || 'Usuario'
  const tipoEtiqueta =
    nombresTipo[documento.tipo] || documento.tipo || 'Pregunta'

  const iniciales = autor
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()

  return {
    ...documento,
    id: documento.id,
    autor,
    autorId: documento.autorId || null,
    iniciales,
    tipoEtiqueta,
    modeloEtiqueta:
      tipoEtiqueta === 'Comparación'
        ? `${documento.modelo} vs. ${documento.modeloComparado}`
        : documento.modelo,
    calificacionTexto:
      tipoEtiqueta === 'Reseña'
        ? String(documento.calificacion || 0)
        : '—',
  }
}

function Comunidad() {
  const { usuario, perfil, esAdmin, cargando: cargandoSesion } = useAuth()

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [filtroActivo, setFiltroActivo] = useState('Todos')
  const [formulario, setFormulario] = useState(formularioInicial)
  const [publicacionEditando, setPublicacionEditando] = useState(null)
  const [mensajePublicacion, setMensajePublicacion] = useState('')
  const [errorFormulario, setErrorFormulario] = useState('')
  const [publicacionesActuales, setPublicacionesActuales] = useState([])
  const [cargandoPublicaciones, setCargandoPublicaciones] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [publicando, setPublicando] = useState(false)

  const [publicacionAEliminar, setPublicacionAEliminar] = useState(null)
  const [justificacion, setJustificacion] = useState('')
  const [errorModeracion, setErrorModeracion] = useState('')
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    let componenteActivo = true

    async function cargarPublicaciones() {
      try {
        const documentos = await obtenerPublicaciones()

        if (componenteActivo) {
          setPublicacionesActuales(
            documentos.map(adaptarPublicacion),
          )
        }
      } catch (error) {
        console.error(error)

        if (componenteActivo) {
          setErrorCarga('No se pudieron cargar las publicaciones.')
        }
      } finally {
        if (componenteActivo) {
          setCargandoPublicaciones(false)
        }
      }
    }

    cargarPublicaciones()

    return () => {
      componenteActivo = false
    }
  }, [])

  const manejarCambio = (evento) => {
    const { name, value } = evento.target

    setErrorFormulario('')
    setFormulario((datosActuales) => ({
      ...datosActuales,
      [name]: value,
    }))
  }

  const seleccionarCalificacion = (calificacion) => {
    setErrorFormulario('')
    setFormulario((datosActuales) => ({
      ...datosActuales,
      calificacion:
        datosActuales.calificacion === calificacion
          ? 0
          : calificacion,
    }))
  }

  const reiniciarFormulario = () => {
    setFormulario(formularioInicial)
    setPublicacionEditando(null)
    setErrorFormulario('')
    setMostrarFormulario(false)
  }

  const abrirNuevaPublicacion = () => {
    if (!usuario) {
      setMensajePublicacion(
        'Iniciá sesión para crear una publicación.',
      )
      return
    }

    setFormulario(formularioInicial)
    setPublicacionEditando(null)
    setErrorFormulario('')
    setMensajePublicacion('')
    setMostrarFormulario(true)
  }

  const iniciarEdicion = (publicacion) => {
    if (!usuario || publicacion.autorId !== usuario.uid) {
      return
    }

    setFormulario({
      tipo: publicacion.tipoEtiqueta,
      modelo: publicacion.modelo || 'Chorizo Parmesano',
      modeloSecundario:
        publicacion.modeloComparado || 'Molino 1',
      calificacion: Number(publicacion.calificacion || 0),
      titulo: publicacion.titulo || '',
      resumen: publicacion.contenido || '',
    })
    setPublicacionEditando(publicacion)
    setErrorFormulario('')
    setMensajePublicacion('')
    setMostrarFormulario(true)

    requestAnimationFrame(() => {
      document
        .getElementById('formulario-publicacion')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    })
  }

  const manejarPublicacion = async (evento) => {
    evento.preventDefault()

    if (!usuario) {
      setErrorFormulario(
        'Tenés que iniciar sesión para publicar.',
      )
      return
    }

    const titulo = formulario.titulo.trim()
    const resumen = formulario.resumen.trim()

    if (!titulo || !resumen) {
      setErrorFormulario(
        'Completá todos los campos obligatorios.',
      )
      return
    }

    if (
      formulario.tipo === 'Reseña'
      && formulario.calificacion === 0
    ) {
      setErrorFormulario(
        'Elegí una calificación de 1 a 5 estrellas.',
      )
      return
    }

    if (
      formulario.tipo === 'Comparación'
      && formulario.modelo === formulario.modeloSecundario
    ) {
      setErrorFormulario(
        'Elegí dos modelos diferentes para comparar.',
      )
      return
    }

    const datosEditables = {
      tipo: tiposFirebase[formulario.tipo],
      modelo: formulario.modelo,
      modeloComparado:
        formulario.tipo === 'Comparación'
          ? formulario.modeloSecundario
          : null,
      calificacion:
        formulario.tipo === 'Reseña'
          ? Number(formulario.calificacion)
          : null,
      titulo,
      contenido: resumen,
    }

    try {
      setPublicando(true)
      setErrorFormulario('')
      setMensajePublicacion('')

      if (publicacionEditando) {
        const documentoActualizado = await actualizarPublicacion(
          publicacionEditando.id,
          datosEditables,
        )

        setPublicacionesActuales((actuales) =>
          actuales.map((publicacion) =>
            publicacion.id === publicacionEditando.id
              ? adaptarPublicacion({
                  ...publicacion,
                  ...documentoActualizado,
                })
              : publicacion,
          ),
        )

        setMensajePublicacion(
          'La publicación se actualizó correctamente.',
        )
      } else {
        const datosPublicacion = {
          ...datosEditables,
          autorId: usuario.uid,
          autor:
            perfil?.nombre
            || usuario.displayName
            || usuario.email
            || 'Usuario',
        }

        const documentoCreado =
          await crearPublicacion(datosPublicacion)

        setPublicacionesActuales((actuales) => [
          adaptarPublicacion(documentoCreado),
          ...actuales,
        ])

        setMensajePublicacion(
          'La publicación se guardó correctamente.',
        )
      }

      reiniciarFormulario()
    } catch (error) {
      console.error('Error al guardar la publicación:', error)
      setErrorFormulario(
        'No se pudo guardar la publicación en Firebase.',
      )
    } finally {
      setPublicando(false)
    }
  }

  const abrirPanelEliminacion = (publicacion) => {
    if (!esAdmin) {
      return
    }

    setPublicacionAEliminar(publicacion)
    setJustificacion('')
    setErrorModeracion('')
  }

  const cerrarPanelEliminacion = () => {
    if (eliminando) {
      return
    }

    setPublicacionAEliminar(null)
    setJustificacion('')
    setErrorModeracion('')
  }

  const manejarEliminacion = async (evento) => {
    evento.preventDefault()

    const motivo = justificacion.trim()

    if (!esAdmin || !usuario || !publicacionAEliminar) {
      setErrorModeracion(
        'No tenés permisos para eliminar publicaciones.',
      )
      return
    }

    if (motivo.length < 10) {
      setErrorModeracion(
        'La justificación debe tener al menos 10 caracteres.',
      )
      return
    }

    try {
      setEliminando(true)
      setErrorModeracion('')

      await eliminarPublicacionConJustificacion({
        publicacion: publicacionAEliminar,
        administrador: usuario,
        justificacion: motivo,
      })

      setPublicacionesActuales((actuales) =>
        actuales.filter(
          (publicacion) =>
            publicacion.id !== publicacionAEliminar.id,
        ),
      )
      setMensajePublicacion(
        'La publicación fue eliminada y la justificación quedó registrada.',
      )
      setPublicacionAEliminar(null)
      setJustificacion('')
    } catch (error) {
      console.error('Error al eliminar la publicación:', error)
      setErrorModeracion(
        'No se pudo eliminar la publicación.',
      )
    } finally {
      setEliminando(false)
    }
  }

  const publicacionesFiltradas =
    filtroActivo === 'Todos'
      ? publicacionesActuales
      : publicacionesActuales.filter(
          (publicacion) =>
            publicacion.tipoEtiqueta === filtroActivo,
        )

  return (
    <div className="comunidad-pagina">
      <Navbar />

      <header className="comunidad-encabezado">
        <div className="comunidad-encabezado-contenido">
          <p className="comunidad-etiqueta">
            La voz de la comunidad
          </p>
          <h1>Hablemos de zapatillas.</h1>
          <p className="comunidad-introduccion">
            Opiniones, preguntas y experiencias reales sobre los
            modelos de The Big Foot.
          </p>
        </div>
      </header>

      <main className="comunidad-contenido">
        <section
          className="comunidad-feed"
          aria-labelledby="titulo-conversaciones"
        >
          <section
            className="comunidad-compositor"
            aria-label="Crear publicación"
          >
            <div>
              <p className="comunidad-compositor-titulo">
                Compartí tu experiencia
              </p>
              <p className="comunidad-compositor-texto">
                {usuario
                  ? 'Publicá una reseña, una pregunta o una comparación.'
                  : 'Iniciá sesión para participar en la comunidad.'}
              </p>
            </div>

            {usuario ? (
              <button
                type="button"
                className="comunidad-crear-boton"
                aria-expanded={mostrarFormulario}
                aria-controls="formulario-publicacion"
                onClick={
                  mostrarFormulario
                    ? reiniciarFormulario
                    : abrirNuevaPublicacion
                }
              >
                <Plus size={19} strokeWidth={2} />
                {mostrarFormulario
                  ? 'Cerrar formulario'
                  : 'Nueva publicación'}
              </button>
            ) : (
              <Link
                to="/login"
                className="comunidad-crear-boton"
                aria-disabled={cargandoSesion}
              >
                Ingresar para publicar
              </Link>
            )}
          </section>

          {mostrarFormulario && usuario && (
            <section
              id="formulario-publicacion"
              className="comunidad-formulario-panel"
              aria-labelledby="titulo-formulario-publicacion"
            >
              <div className="comunidad-formulario-encabezado">
                <div>
                  <p className="comunidad-etiqueta">
                    {publicacionEditando
                      ? 'Tu publicación'
                      : 'Nueva conversación'}
                  </p>
                  <h2 id="titulo-formulario-publicacion">
                    {publicacionEditando
                      ? 'Editar publicación'
                      : 'Agregar publicación'}
                  </h2>
                </div>
                <p>
                  Publicando como{' '}
                  <strong>
                    {perfil?.nombre
                      || usuario.displayName
                      || usuario.email}
                  </strong>
                </p>
              </div>

              <form
                className="comunidad-formulario"
                onSubmit={manejarPublicacion}
              >
                <label>
                  Tipo de publicación
                  <select
                    name="tipo"
                    value={formulario.tipo}
                    onChange={manejarCambio}
                  >
                    <option value="Reseña">Reseña</option>
                    <option value="Pregunta">Pregunta</option>
                    <option value="Comparación">
                      Comparación
                    </option>
                  </select>
                </label>

                {formulario.tipo === 'Comparación' ? (
                  <div className="comunidad-comparacion-campos">
                    <label>
                      Primer modelo
                      <select
                        name="modelo"
                        value={formulario.modelo}
                        onChange={manejarCambio}
                      >
                        <option value="Chorizo Parmesano">
                          Chorizo Parmesano
                        </option>
                        <option value="Molino 1">Molino 1</option>
                        <option value="Molino 2">Molino 2</option>
                        <option value="Otro modelo">
                          Otro modelo
                        </option>
                      </select>
                    </label>

                    <label>
                      Segundo modelo
                      <select
                        name="modeloSecundario"
                        value={formulario.modeloSecundario}
                        onChange={manejarCambio}
                      >
                        <option value="Chorizo Parmesano">
                          Chorizo Parmesano
                        </option>
                        <option value="Molino 1">Molino 1</option>
                        <option value="Molino 2">Molino 2</option>
                        <option value="Otro modelo">
                          Otro modelo
                        </option>
                      </select>
                    </label>
                  </div>
                ) : (
                  <label>
                    Modelo
                    <select
                      name="modelo"
                      value={formulario.modelo}
                      onChange={manejarCambio}
                    >
                      <option value="Chorizo Parmesano">
                        Chorizo Parmesano
                      </option>
                      <option value="Molino 1">Molino 1</option>
                      <option value="Molino 2">Molino 2</option>
                      <option value="Otro modelo">
                        Otro modelo
                      </option>
                    </select>
                  </label>
                )}

                {formulario.tipo === 'Reseña' && (
                  <fieldset className="comunidad-calificacion">
                    <legend>Calificación</legend>

                    <div className="comunidad-estrellas">
                      {[1, 2, 3, 4, 5].map((estrella) => (
                        <button
                          key={estrella}
                          type="button"
                          className={
                            estrella <= formulario.calificacion
                              ? 'comunidad-estrella comunidad-estrella-activa'
                              : 'comunidad-estrella'
                          }
                          aria-label={
                            `Calificar con ${estrella} ${estrella === 1 ? 'estrella' : 'estrellas'}`
                          }
                          aria-pressed={
                            estrella === formulario.calificacion
                          }
                          onClick={() =>
                            seleccionarCalificacion(estrella)
                          }
                        >
                          <Star size={27} strokeWidth={1.8} />
                        </button>
                      ))}

                      <span>
                        {formulario.calificacion
                          ? `${formulario.calificacion} de 5`
                          : 'Sin calificar'}
                      </span>
                    </div>
                  </fieldset>
                )}

                <label>
                  Título
                  <input
                    type="text"
                    name="titulo"
                    value={formulario.titulo}
                    onChange={manejarCambio}
                    maxLength="90"
                    placeholder="Escribí un título claro"
                    required
                  />
                </label>

                <label>
                  Contenido
                  <textarea
                    name="resumen"
                    value={formulario.resumen}
                    onChange={manejarCambio}
                    rows="6"
                    maxLength="600"
                    placeholder="Contá tu experiencia o escribí tu pregunta"
                    required
                  />
                </label>

                {errorFormulario && (
                  <p
                    className="comunidad-error-formulario"
                    role="alert"
                  >
                    {errorFormulario}
                  </p>
                )}

                <div className="comunidad-formulario-final">
                  <span className="comunidad-contador">
                    {formulario.resumen.length} / 600
                  </span>

                  <div className="comunidad-formulario-acciones">
                    <button
                      type="button"
                      className="comunidad-boton-secundario"
                      onClick={reiniciarFormulario}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="comunidad-boton-publicar"
                      disabled={publicando}
                    >
                      {publicando
                        ? 'Guardando...'
                        : publicacionEditando
                          ? 'Guardar cambios'
                          : 'Publicar'}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

          {mensajePublicacion && (
            <p
              className="comunidad-mensaje-publicacion"
              role="status"
            >
              {mensajePublicacion}
            </p>
          )}

          <div className="comunidad-feed-encabezado">
            <div>
              <p className="comunidad-etiqueta">Foro</p>
              <h2 id="titulo-conversaciones">
                Conversaciones recientes
              </h2>
            </div>

            <div
              className="comunidad-categorias"
              aria-label="Categorías"
            >
              {[
                { etiqueta: 'Todos', valor: 'Todos' },
                { etiqueta: 'Reseñas', valor: 'Reseña' },
                { etiqueta: 'Preguntas', valor: 'Pregunta' },
                {
                  etiqueta: 'Comparaciones',
                  valor: 'Comparación',
                },
              ].map((categoria) => (
                <button
                  key={categoria.valor}
                  type="button"
                  className={
                    filtroActivo === categoria.valor
                      ? 'comunidad-categoria comunidad-categoria-activa'
                      : 'comunidad-categoria'
                  }
                  aria-pressed={
                    filtroActivo === categoria.valor
                  }
                  onClick={() =>
                    setFiltroActivo(categoria.valor)
                  }
                >
                  {categoria.etiqueta}
                </button>
              ))}
            </div>
          </div>

          <div
            className="comunidad-publicaciones"
            aria-live="polite"
          >
            {cargandoPublicaciones && (
              <p className="comunidad-sin-resultados">
                Cargando publicaciones...
              </p>
            )}

            {errorCarga && (
              <p
                className="comunidad-error-formulario"
                role="alert"
              >
                {errorCarga}
              </p>
            )}

            {!cargandoPublicaciones
              && !errorCarga
              && publicacionesFiltradas.length === 0 && (
                <p className="comunidad-sin-resultados">
                  Todavía no hay publicaciones en esta categoría.
                </p>
              )}

            {publicacionesFiltradas.map((publicacion) => {
              const esPublicacionPropia =
                usuario?.uid === publicacion.autorId

              return (
                <article
                  className="comunidad-publicacion"
                  key={publicacion.id}
                >
                  <div
                    className="comunidad-avatar"
                    aria-hidden="true"
                  >
                    {publicacion.iniciales}
                  </div>

                  <div className="comunidad-publicacion-contenido">
                    <div className="comunidad-publicacion-superior">
                      <div className="comunidad-publicacion-meta">
                        <span>{publicacion.autor}</span>
                        <span>{publicacion.modeloEtiqueta}</span>
                        <span className="comunidad-tipo">
                          {publicacion.tipoEtiqueta}
                        </span>
                      </div>

                      {(esPublicacionPropia || esAdmin) && (
                        <div className="comunidad-publicacion-acciones">
                          {esPublicacionPropia && (
                            <button
                              type="button"
                              className="comunidad-accion-editar"
                              onClick={() =>
                                iniciarEdicion(publicacion)
                              }
                            >
                              <Pencil size={15} />
                              Editar
                            </button>
                          )}

                          {esAdmin && (
                            <button
                              type="button"
                              className="comunidad-accion-eliminar"
                              onClick={() =>
                                abrirPanelEliminacion(publicacion)
                              }
                            >
                              <Trash2 size={15} />
                              Eliminar
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <h3>{publicacion.titulo}</h3>
                    <p>{publicacion.contenido}</p>

                    <footer className="comunidad-publicacion-datos">
                      <span>
                        <TrendingUp size={17} strokeWidth={1.9} />
                        {publicacion.votos || 0} votos
                      </span>
                      <span>
                        <MessageCircle
                          size={17}
                          strokeWidth={1.9}
                        />
                        {publicacion.comentarios || 0} comentarios
                      </span>
                      <span>
                        <Star size={17} strokeWidth={1.9} />
                        {publicacion.calificacionTexto}
                      </span>
                    </footer>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <aside className="comunidad-lateral">
          <section className="comunidad-panel">
            <p className="comunidad-etiqueta">
              Antes de publicar
            </p>
            <h2>Reglas básicas</h2>
            <ul>
              <li>
                Compartí experiencias relacionadas con los productos.
              </li>
              <li>
                Respetá las opiniones de los demás usuarios.
              </li>
              <li>Evitá publicar información personal.</li>
            </ul>
          </section>

          <section className="comunidad-panel">
            <p className="comunidad-etiqueta">Tendencias</p>
            <h2>Modelos mencionados</h2>
            <ol className="comunidad-modelos">
              <li>
                <span>Rayo Anaranjado</span>
                <strong>28</strong>
              </li>
              <li>
                <span>Chorizo Parmesano</span>
                <strong>19</strong>
              </li>
            </ol>
          </section>
        </aside>
      </main>

      <Footer />

      {publicacionAEliminar && (
        <div
          className="comunidad-modal-fondo"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarPanelEliminacion()
            }
          }}
        >
          <section
            className="comunidad-moderacion-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-moderacion"
          >
            <p className="comunidad-etiqueta">
              Moderación administrativa
            </p>
            <h2 id="titulo-moderacion">
              Justificar eliminación
            </h2>
            <p>
              Se eliminará “{publicacionAEliminar.titulo}”. El
              motivo quedará guardado en el historial de
              moderación.
            </p>

            <form onSubmit={manejarEliminacion}>
              <label htmlFor="justificacion-eliminacion">
                Justificación obligatoria
              </label>
              <textarea
                id="justificacion-eliminacion"
                value={justificacion}
                onChange={(evento) => {
                  setJustificacion(evento.target.value)
                  setErrorModeracion('')
                }}
                rows="5"
                maxLength="400"
                placeholder="Explicá por qué se elimina esta publicación"
                autoFocus
                required
              />
              <span className="comunidad-contador">
                {justificacion.length} / 400
              </span>

              {errorModeracion && (
                <p
                  className="comunidad-error-formulario"
                  role="alert"
                >
                  {errorModeracion}
                </p>
              )}

              <div className="comunidad-moderacion-acciones">
                <button
                  type="button"
                  className="comunidad-boton-secundario"
                  onClick={cerrarPanelEliminacion}
                  disabled={eliminando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="comunidad-boton-eliminar"
                  disabled={eliminando}
                >
                  {eliminando
                    ? 'Eliminando...'
                    : 'Eliminar publicación'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Comunidad
