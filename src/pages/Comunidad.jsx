import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Search,
  ShoppingCart,
  Star,
  TrendingUp,
  UserRound,
} from 'lucide-react'

import logo from '../assets/Logo_Web.jpeg'
import './Inicio.css'
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
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo The Big Foot" />
        </Link>

        <div className="navbar-menu">
          <Link to="/catalogo">Modelos</Link>
          <Link to="/personalizar">Personalizar</Link>
          <Link to="/comunidad">Comunidad</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="navbar-iconos">
          <Link to="/login" aria-label="Iniciar sesión">
            <UserRound />
          </Link>

          <Link to="/carrito" aria-label="Carrito">
            <ShoppingCart />
          </Link>

          <button type="button" aria-label="Buscar">
            <Search />
          </button>
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
    </div>
  )
}

export default Comunidad
