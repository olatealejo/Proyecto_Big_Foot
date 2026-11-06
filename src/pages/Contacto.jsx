import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Users,
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import fotoAlejo from '../assets/contactos/alejo.webp'
import fotoGino from '../assets/contactos/gino.webp'
import fotoB1Plus from '../assets/contactos/b1plus.webp'
import './Contacto.css'

const contactos = [
  {
    codigo: '01',
    nombre: 'Alejo',
    instagram: 'olatealejo',
    telefono: '2995754348',
    telefonoVisible: '299 575-4348',
    foto: fotoAlejo,
    alt: 'Alejo, integrante del equipo The Big Foot',
    clase: 'contacto-foto-alejo',
  },
  {
    codigo: '02',
    nombre: 'Gino',
    instagram: 'ginoforneron',
    telefono: '2994288130',
    telefonoVisible: '299 428-8130',
    foto: fotoGino,
    alt: 'Gino, integrante del equipo The Big Foot',
    clase: 'contacto-foto-gino',
  },
  {
    codigo: '03',
    nombre: 'B1Plus',
    instagram: 'B1Plus',
    telefono: '2994107101',
    telefonoVisible: '299 410-7101',
    foto: fotoB1Plus,
    alt: 'B1Plus, integrante del equipo The Big Foot',
    clase: 'contacto-foto-b1plus',
  },
]

function Contacto() {
  return (
    <div className="contacto-pagina">
      <Navbar />

      <main className="contacto-main">
        <section className="contacto-hero" aria-labelledby="contacto-titulo">
          <div className="contacto-hero-contenido">
            <p className="contacto-etiqueta">
              <Users size={17} aria-hidden="true" />
              Equipo The Big Foot
            </p>

            <h1 id="contacto-titulo">
              Hablemos de tu próxima <span>jugada.</span>
            </h1>

            <p className="contacto-hero-texto">
              Consultas sobre modelos, pedidos o la comunidad. Elegí un contacto
              y escribinos directamente.
            </p>

            <div className="contacto-hero-acciones">
              <a className="contacto-boton contacto-boton-principal" href="#equipo">
                Ver contactos
                <ArrowRight size={18} aria-hidden="true" />
              </a>

              <Link
                className="contacto-boton contacto-boton-secundario"
                to="/productos"
              >
                Explorar modelos
              </Link>
            </div>
          </div>

          <aside className="contacto-resumen" aria-label="Información de contacto">
            <div className="contacto-resumen-cabecera">
              <span>Contacto directo</span>
              <span>BF / 03</span>
            </div>

            <p className="contacto-resumen-numero" aria-hidden="true">
              03
            </p>

            <div className="contacto-resumen-datos">
              <div>
                <MapPin size={19} aria-hidden="true" />
                <span>
                  <small>Ubicación</small>
                  <strong>Neuquén, Argentina</strong>
                </span>
              </div>

              <div>
                <Users size={19} aria-hidden="true" />
                <span>
                  <small>Equipo</small>
                  <strong>Tres contactos disponibles</strong>
                </span>
              </div>

              <div>
                <MessageCircle size={19} aria-hidden="true" />
                <span>
                  <small>Canales</small>
                  <strong>Instagram, WhatsApp y teléfono</strong>
                </span>
              </div>
            </div>
          </aside>
        </section>

        <section
          id="equipo"
          className="contacto-equipo"
          aria-labelledby="contacto-equipo-titulo"
        >
          <header className="contacto-seccion-encabezado">
            <div>
              <p className="contacto-etiqueta">Contacto personal</p>
              <h2 id="contacto-equipo-titulo">Elegí a quién escribirle.</h2>
            </div>

            <p>
              Cada perfil tiene acceso directo a Instagram, WhatsApp y llamada.
            </p>
          </header>

          <div className="contacto-listado">
            {contactos.map((contacto) => (
              <article className="contacto-tarjeta" key={contacto.codigo}>
                <div className="contacto-imagen">
                  <img
                    src={contacto.foto}
                    alt={contacto.alt}
                    className={contacto.clase}
                    loading="lazy"
                  />

                  <span className="contacto-indice" aria-hidden="true">
                    {contacto.codigo}
                  </span>

                  <div className="contacto-imagen-marca" aria-hidden="true">
                    The Big Foot
                  </div>
                </div>

                <div className="contacto-tarjeta-cuerpo">
                  <p>Equipo Big Foot / {contacto.codigo}</p>
                  <h3>{contacto.nombre}</h3>

                  <a
                    className="contacto-telefono"
                    href={`tel:+54${contacto.telefono}`}
                    aria-label={`Llamar a ${contacto.nombre} al ${contacto.telefonoVisible}`}
                  >
                    <Phone size={17} aria-hidden="true" />
                    {contacto.telefonoVisible}
                  </a>

                  <div className="contacto-tarjeta-acciones">
                    <a
                      href={`https://www.instagram.com/${contacto.instagram}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Instagram de ${contacto.nombre}: @${contacto.instagram}`}
                    >
                      <Instagram size={18} aria-hidden="true" />
                      Instagram
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>

                    <a
                      href={`https://wa.me/549${contacto.telefono}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Escribir a ${contacto.nombre} por WhatsApp`}
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                      Escribir
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contacto-cta" aria-labelledby="contacto-cta-titulo">
          <div>
            <p className="contacto-etiqueta">Antes de escribir</p>
            <h2 id="contacto-cta-titulo">
              Mirá el catálogo y encontrá el modelo que querés consultar.
            </h2>
          </div>

          <Link to="/productos">
            Ir al catálogo
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contacto
