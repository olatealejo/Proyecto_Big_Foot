import { Camera } from 'lucide-react'

import logo from '../assets/Logo_Web.jpeg'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <div className="footer-logo">
          <img src={logo} alt="The Big Foot" />
        </div>

        <div className="footer-seccion">
          <h3>THE BIG FOOT</h3>
          <a href="#">La primera pisada</a>
        </div>

        <div className="footer-seccion">
          <h3>COMUNIDAD</h3>
          <a href="#">Reseñas</a>
        </div>

        <div className="footer-seccion">
          <h3>REDES</h3>

          <a href="#" aria-label="Instagram">
            <Camera size={20} strokeWidth={1.8} />
          </a>
        </div>
      </div>

      <div className="footer-final">
        <p>© 2026 The Big Foot Store</p>
      </div>
    </footer>
  )
}

export default Footer