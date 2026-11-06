import { Routes, Route } from 'react-router-dom'

import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import ProductoMolino1 from './pages/ProductoMolino1'
import ProductoMolino2 from './pages/ProductoMolino2'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Inicio />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/productos/chorizo-parmesano" element={<ProductoDetalle />} />
      <Route path="/productos/molino-1" element={<ProductoMolino1 />} />
      <Route path="/productos/molino-2" element={<ProductoMolino2 />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
    </Routes>
  )
}

export default App