import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Plus,
  ShoppingCart,
  Star,
  TrendingUp,
  UserRound,
} from 'lucide-react'

import logo from '../assets/Logo_Web_transparente.png'
import Footer from '../components/Footer'
import './Comunidad.css'

const publicaciones = [
  {
    id: 1,
    iniciales: 'AO',
    usuario: 'Alejo',
    modelo: 'Rayo Anaranjado',
    tipo: 'Pregunta',
    titulo: '¿Cómo responde este modelo en cancha exterior?',
    resumen:
      'Estoy buscando una zapatilla con buena tracción para cemento. ¿Alguien ya la probó durante varias semanas?',
    votos: 24,
    comentarios: 12,
    calificacion: '4.8',
  },
  {
    id: 2,
    iniciales: 'GF',
    usuario: 'Gino',
    modelo: 'Chorizo Parmesano',
    tipo: 'Reseña',
    titulo: 'Cómodas desde el primer entrenamiento',
    resumen:
      'La amortiguación se siente firme y el ajuste del talón es muy bueno. El diseño llama bastante la atención.',
    votos: 18,
    comentarios: 7,
    calificacion: '4.5',
  },
  {
    id: 3,
    iniciales: 'LV',
    usuario: 'Lourdes',
    modelo: 'Rayo Anaranjado',
    tipo: 'Comparación',
    titulo: 'Rayo Anaranjado frente a Chorizo Parmesano',
    resumen:
      'Los dos modelos tienen personalidades distintas. Comparto las diferencias que noté en comodidad y agarre.',
    votos: 15,
    comentarios: 9,
    calificacion: '4.6',
  },
]

function Comunidad() {
  return (
    <div className="comunidad-pagina">
      <nav className="navbar" aria-label="Navegación principal">
        <Link to="/" className="navbar-logo" aria-label="Ir al inicio">
          <img src={logo} alt="The Big Foot" />
        </Link>

        <div className="navbar-menu">
          <Link to="/productos">Modelos</Link>
          <Link to="/personalizar">Personalizar</Link>
          <Link to="/comunidad">Comunidad</Link>
        </div>

        <div className="navbar-iconos">
          <Link to="/login" aria-label="Iniciar sesión">
            <UserRound />
          </Link>

          <Link to="/carrito" aria-label="Ver carrito">
            <ShoppingCart />
          </Link>
        </div>
      </nav>

      <header className="comunidad-encabezado">
        <div className="comunidad-encabezado-contenido">
          <p className="comunidad-etiqueta">La voz de la comunidad</p>
          <h1>Hablemos de zapatillas.</h1>
          <p className="comunidad-introduccion">
            Opiniones, preguntas y experiencias reales sobre los modelos de
            The Big Foot.
          </p>
        </div>
      </header>

      <main className="comunidad-contenido">
        <section className="comunidad-feed" aria-labelledby="titulo-conversaciones">
          <section className="comunidad-compositor" aria-label="Crear publicación">
            <div>
              <p className="comunidad-compositor-titulo">Compartí tu experiencia</p>
              <p className="comunidad-compositor-texto">
                Publicá una reseña, una pregunta o una comparación.
              </p>
            </div>

            <button type="button" className="comunidad-crear-boton">
              <Plus size={19} strokeWidth={2} />
              Nueva publicación
            </button>
          </section>

          <section
            className="comunidad-formulario-panel"
            aria-labelledby="titulo-nueva-publicacion"
          >
            <div className="comunidad-formulario-encabezado">
              <div>
                <p className="comunidad-etiqueta">Nueva conversación</p>
                <h2 id="titulo-nueva-publicacion">Agregar publicación</h2>
              </div>
              <p>Todos los campos son necesarios para publicar.</p>
            </div>

            <form
              className="comunidad-formulario"
              onSubmit={(evento) => evento.preventDefault()}
            >
              <div className="comunidad-formulario-fila">
                <label>
                  Nombre
                  <input
                    type="text"
                    name="usuario"
                    maxLength="30"
                    placeholder="Tu nombre"
                    required
                  />
                </label>

                <label>
                  Tipo de publicación
                  <select name="tipo">
                    <option value="Reseña">Reseña</option>
                    <option value="Pregunta">Pregunta</option>
                    <option value="Comparación">Comparación</option>
                  </select>
                </label>
              </div>

              <label>
                Modelo
                <select name="modelo">
                  <option value="Chorizo Parmesano">Chorizo Parmesano</option>
                  <option value="Molino 1">Molino 1</option>
                  <option value="Molino 2">Molino 2</option>
                  <option value="Otro modelo">Otro modelo</option>
                </select>
              </label>

              <label>
                Título
                <input
                  type="text"
                  name="titulo"
                  maxLength="90"
                  placeholder="Escribí un título claro"
                  required
                />
              </label>

              <label>
                Contenido
                <textarea
                  name="resumen"
                  rows="6"
                  maxLength="600"
                  placeholder="Contá tu experiencia o escribí tu pregunta"
                  required
                />
              </label>

              <div className="comunidad-formulario-final">
                <span className="comunidad-contador">0 / 600</span>

                <div className="comunidad-formulario-acciones">
                  <button type="button" className="comunidad-boton-secundario">
                    Cancelar
                  </button>
                  <button type="submit" className="comunidad-boton-publicar">
                    Publicar
                  </button>
                </div>
              </div>
            </form>

            <p className="comunidad-aviso-temporal">
              Versión de prueba: la publicación se conservará solamente durante
              esta sesión hasta conectar la base de datos.
            </p>
          </section>

          <div className="comunidad-feed-encabezado">
            <div>
              <p className="comunidad-etiqueta">Foro</p>
              <h2 id="titulo-conversaciones">Conversaciones recientes</h2>
            </div>

            <div className="comunidad-categorias" aria-label="Categorías">
              <span className="comunidad-categoria comunidad-categoria-activa">
                Todos
              </span>
              <span className="comunidad-categoria">Reseñas</span>
              <span className="comunidad-categoria">Preguntas</span>
              <span className="comunidad-categoria">Comparaciones</span>
            </div>
          </div>

          <div className="comunidad-publicaciones">
            {publicaciones.map((publicacion) => (
              <article className="comunidad-publicacion" key={publicacion.id}>
                <div className="comunidad-avatar" aria-hidden="true">
                  {publicacion.iniciales}
                </div>

                <div className="comunidad-publicacion-contenido">
                  <div className="comunidad-publicacion-meta">
                    <span>{publicacion.usuario}</span>
                    <span>{publicacion.modelo}</span>
                    <span className="comunidad-tipo">{publicacion.tipo}</span>
                  </div>

                  <h3>{publicacion.titulo}</h3>
                  <p>{publicacion.resumen}</p>

                  <footer className="comunidad-publicacion-datos">
                    <span>
                      <TrendingUp size={17} strokeWidth={1.9} />
                      {publicacion.votos} votos
                    </span>
                    <span>
                      <MessageCircle size={17} strokeWidth={1.9} />
                      {publicacion.comentarios} comentarios
                    </span>
                    <span>
                      <Star size={17} strokeWidth={1.9} />
                      {publicacion.calificacion}
                    </span>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="comunidad-lateral">
          <section className="comunidad-panel">
            <p className="comunidad-etiqueta">Antes de publicar</p>
            <h2>Reglas básicas</h2>
            <ul>
              <li>Compartí experiencias relacionadas con los productos.</li>
              <li>Respetá las opiniones de los demás usuarios.</li>
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
    </div>
  )
}

export default Comunidad
