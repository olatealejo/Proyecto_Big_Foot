import { Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'

import logo from '../assets/Logo_Web.jpeg'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <div className="footer-marca">
          <Link to="/" className="footer-logo" aria-label="Ir al inicio">
            <img src={logo} alt="The Big Foot" />
          </Link>

          <p>
            Zapatillas con identidad propia para quienes eligen marcar su
            camino.
          </p>
        </div>

        <nav className="footer-seccion" aria-label="The Big Foot">
          <h3>The Big Foot</h3>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/productos">Modelos</Link>
        </nav>

        <nav className="footer-seccion" aria-label="Ayuda">
          <h3>Ayuda</h3>
          <Link to="/contacto">Contacto</Link>
          <Link to="/login">Mi cuenta</Link>
        </nav>

        <div className="footer-contacto">
          <Mail size={22} strokeWidth={1.7} />

          <div>
            <p>¿Necesitás ayuda?</p>
            <h3>Estamos para ayudarte.</h3>
          </div>

          <Link to="/contacto">
            Ir a contacto
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="footer-final">
        <p>© 2026 The Big Foot Store</p>
        <p>Diseñá tu camino. Dejá tu huella.</p>
      </div>
    </footer>
  )
}

export default Footer
