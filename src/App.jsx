import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './cart/CartProvider'
import { AuthProvider } from './context/AuthContext'
import { CatalogProvider } from './catalogo/CatalogProvider'
import CartDrawer from './components/CartDrawer'

import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Comunidad from './pages/Comunidad'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import ProductoMolino1 from './pages/ProductoMolino1'
import ProductoMolino2 from './pages/ProductoMolino2'
import ProductoDinamico from './pages/ProductoDinamico'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'

function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Signup />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/chorizo-parmesano" element={<ProductoDetalle />} />
        <Route path="/productos/molino-1" element={<ProductoMolino1 />} />
        <Route path="/productos/molino-2" element={<ProductoMolino2 />} />
        <Route path="/productos/:sku" element={<ProductoDinamico />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
          </Routes>
          <CartDrawer />
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  )
}

export default App
