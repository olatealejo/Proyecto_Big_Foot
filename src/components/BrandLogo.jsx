import { Link } from 'react-router-dom'
import logo from '../assets/Logo_Web_transparente.png'
import './BrandLogo.css'

// Un único logotipo transparente para todas las barras de navegación.
export default function BrandLogo({ className = '' }) {
  return (
    <Link to="/" className={['bigfoot-brand', className].filter(Boolean).join(' ')} aria-label="The Big Foot: ir al inicio">
      <img src={logo} alt="The Big Foot" />
    </Link>
  )
}
