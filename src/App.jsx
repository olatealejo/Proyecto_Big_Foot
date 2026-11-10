import {
  Route,
  Routes,
} from 'react-router-dom'

import { CartProvider } from './cart/CartProvider'
import { CatalogProvider } from './catalogo/CatalogProvider'
import CartDrawer from './components/CartDrawer'
import { AuthProvider } from './context/AuthContext'
import AdminProductos from './pages/AdminProductos'
import Comunidad from './pages/Comunidad'
import Contacto from './pages/Contacto'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Nosotros from './pages/Nosotros'
import ProductoDetalle from './pages/ProductoDetalle'
import ProductoDinamico from './pages/ProductoDinamico'
import ProductoMolino1 from './pages/ProductoMolino1'
import ProductoMolino2 from './pages/ProductoMolino2'
import Productos from './pages/Productos'
import Signup from './pages/Signup'

function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Signup />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/nosotros" element={<Nosotros />} />

            <Route path="/productos" element={<Productos />} />
            <Route
              path="/admin/productos"
              element={<AdminProductos />}
            />
            <Route
              path="/productos/chorizo-parmesano"
              element={<ProductoDetalle />}
            />
            <Route
              path="/productos/molino-1"
              element={<ProductoMolino1 />}
            />
            <Route
              path="/productos/molino-2"
              element={<ProductoMolino2 />}
            />
            <Route
              path="/productos/:sku"
              element={<ProductoDinamico />}
            />
          </Routes>

          <CartDrawer />
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  )
}

export default App
