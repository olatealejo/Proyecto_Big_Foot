import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Crosshair, Instagram, Phone } from 'lucide-react'
import CartTrigger from '../components/CartTrigger'
import logo from '../assets/Logo_BigFoot_Naranja_Header.png'
import fotoAlejo from '../assets/contactos/alejo.webp'
import fotoGino from '../assets/contactos/gino.webp'
import fotoB1Plus from '../assets/contactos/b1plus.webp'
import './Contacto.css'

const contactos = [
  {
    codigo: '001',
    nombre: 'ALEJO',
    instagram: 'olatealejo',
    telefono: '2995754348',
    foto: fotoAlejo,
    alt: 'Alejo posando con un gallo',
    clase: 'contacto-foto-alejo',
  },
  {
    codigo: '002',
    nombre: 'GINO',
    instagram: 'ginoforneron',
    telefono: '2994288130',
    foto: fotoGino,
    alt: 'Gino con abrigo y gorro de invierno',
    clase: 'contacto-foto-gino',
  },
  {
    codigo: '003',
    nombre: 'B1PLUS',
    instagram: 'B1Plus',
    telefono: '2994107101',
    foto: fotoB1Plus,
    alt: 'B1Plus posando con una remera negra',
    clase: 'contacto-foto-b1plus',
  },
]

function Contacto() {
  return (
    <div className="contacto-pagina">
      <nav className="contacto-nav" aria-label="Navegación de contacto">
        <Link className="contacto-nav-logo" to="/" aria-label="Volver al inicio de The Big Foot">
          <img src={logo} alt="The Big Foot" />
        </Link>
        <div className="contacto-nav-enlaces">
          <Link to="/productos">MODELOS</Link>
          <Link to="/contacto" aria-current="page">CONTACTO</Link>
        </div>
        <div className="contacto-nav-carrito"><CartTrigger /></div>
      </nav>

      <main className="contacto-contenido">
        <header className="contacto-hero">
          <div className="contacto-archivo">
            <span><Crosshair size={17} aria-hidden="true" /> THE BIG FOOT / ARCHIVO DE CONTACTOS</span>
            <span>NEUQUÉN · ARGENTINA</span>
          </div>
          <div className="contacto-encabezado">
            <div>
              <h1>CONTACTOS<span className="contacto-punto">.</span></h1>
              <p>Las personas detrás de The Big Foot, a un mensaje de distancia.</p>
            </div>
            <span className="contacto-serial" aria-hidden="true">BF / 003<br />EDICIÓN ESPECIAL</span>
          </div>
          <div className="contacto-titular">
            <span className="contacto-linea" aria-hidden="true" />
            <div>
              <p>EXPEDIENTE: EQUIPO BIG FOOT</p>
              <h2>LOS MÁS <span>BUSCADOS</span></h2>
            </div>
            <span className="contacto-linea" aria-hidden="true" />
          </div>
          <p className="contacto-aclaracion">Tres perfiles. Tres formas de contactarnos. Una misma identidad.</p>
        </header>

        <section className="contacto-listado" aria-label="Contactos de The Big Foot">
          {contactos.map((contacto) => (
            <article className="contacto-ficha" key={contacto.codigo}>
              <div className="contacto-ficha-superior">
                <span>FICHA N.º {contacto.codigo}</span>
                <span>THE BIG FOOT</span>
              </div>
              <div className="contacto-imagen">
                <img
                  src={contacto.foto}
                  alt={contacto.alt}
                  className={contacto.clase}
                  loading="lazy"
                />
                <span className="contacto-marco-tl" aria-hidden="true" />
                <span className="contacto-marco-br" aria-hidden="true" />
                <span className="contacto-imagen-label">CONTACTO IDENTIFICADO</span>
              </div>
              <div className="contacto-ficha-cuerpo">
                <span className="contacto-ficha-subtitulo">PERSONA DE CONTACTO / {contacto.codigo}</span>
                <h3>{contacto.nombre}</h3>
                <div className="contacto-datos">
                  <a
                    href={`https://www.instagram.com/${contacto.instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram de ${contacto.nombre}: @${contacto.instagram} (abre en nueva pestaña)`}
                  >
                    <Instagram size={19} aria-hidden="true" />
                    <span>@{contacto.instagram}</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                  <a
                    href={`tel:+54${contacto.telefono}`}
                    aria-label={`Llamar a ${contacto.nombre} al ${contacto.telefono}`}
                  >
                    <Phone size={18} aria-hidden="true" />
                    <span>{contacto.telefono}</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="contacto-ficha-pie">
                <span>BF — CONTACTO</span>
                <span>0{contacto.codigo.slice(-1)} / 03</span>
              </div>
            </article>
          ))}
        </section>

        <footer className="contacto-cierre">
          <span>/// THE BIG FOOT — CONTACTO OFICIAL</span>
          <Link to="/"><ArrowLeft size={17} aria-hidden="true" /> VOLVER AL INICIO</Link>
        </footer>
      </main>
    </div>
  )
}

export default Contacto
