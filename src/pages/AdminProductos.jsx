import { Navigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'

import BrandLogo from '../components/BrandLogo'
import PanelAdminProductos from '../components/PanelAdminProductos'
import { useAuth } from '../context/AuthContext'
import './AdminProductos.css'

function AdminProductos() {
  const {
    usuario,
    esAdmin,
    cargando,
  } = useAuth()

  if (cargando) {
    return (
      <main className="admin-catalogo-estado">
        Verificando permisos...
      </main>
    )
  }

  if (!usuario || !esAdmin) {
    return <Navigate to="/productos" replace />
  }

  return (
    <div className="admin-catalogo-pagina">
      <nav
        className="admin-catalogo-navegacion"
        aria-label="Navegación administrativa"
      >
        <Link
          to="/productos"
          className="admin-catalogo-volver"
        >
          <ArrowLeft aria-hidden="true" />
          Volver al catálogo
        </Link>

        <BrandLogo className="admin-catalogo-logo" />

        <span className="admin-catalogo-sesion">
          <ShieldCheck aria-hidden="true" />
          Administrador
        </span>
      </nav>

      <main className="admin-catalogo-contenido">
        <header className="admin-catalogo-presentacion">
          <div>
            <p className="admin-catalogo-etiqueta">
              <LayoutDashboard aria-hidden="true" />
              Panel administrativo
            </p>
            <h1>Gestión del catálogo.</h1>
            <p>
              Administrá modelos activos, precios, imágenes y
              productos retirados desde un espacio independiente.
            </p>
          </div>

          <div className="admin-catalogo-identidad">
            <span>Sesión iniciada como</span>
            <strong>
              {usuario.displayName || usuario.email}
            </strong>
          </div>
        </header>

        <PanelAdminProductos />
      </main>
    </div>
  )
}

export default AdminProductos
