import { Link } from 'react-router-dom'
export default function ProductoNoDisponible() {
  return (
    <main className="detalle-pagina detalle-producto-agotado">
      <h1>Este modelo no está disponible</h1>
      <p>El producto fue retirado o no existe en el catálogo actual.</p>
      <Link to="/productos">Volver a modelos</Link>
    </main>
  )
}
