import { Routes, Route } from 'react-router-dom'

import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Productos from './pages/Productos'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import Comunidad from './pages/Comunidad'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Inicio />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/comunidad" element={<Comunidad />} />
    </Routes>
  )
}

export default App