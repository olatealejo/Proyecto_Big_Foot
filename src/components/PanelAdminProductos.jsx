import { useState } from 'react'
import { Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../catalogo/useCatalog'
import { guardarProducto, cambiarEstadoProducto } from '../services/productosService'
import { formatoPrecio } from '../cart/catalogo'
import './PanelAdminProductos.css'

const formularioVacio = { nombre: '', modelo: '', precio: '', descripcion: '', imagenUrl: '' }

export default function PanelAdminProductos() {
  const { usuario, esAdmin, cargando: cargandoSesion } = useAuth()
  const { productos, archivados, firebaseConfigurado, error: errorCatalogo } = useCatalog()
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState(formularioVacio)
  const [productoAEliminar, setProductoAEliminar] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  if (cargandoSesion || !esAdmin) return null

  const activos = Object.values(productos).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  function abrirNuevo() {
    setEditando(null)
    setFormulario(formularioVacio)
    setFormularioAbierto(true)
    setProductoAEliminar(null)
    setMensaje('')
    setError('')
  }
  function abrirEdicion(producto) {
    setEditando(producto)
    setFormulario({
      nombre: producto.nombre,
      modelo: producto.modelo,
      precio: String(producto.precio),
      descripcion: producto.descripcion || '',
      imagenUrl: producto.imagenUrl || '',
    })
    setFormularioAbierto(true)
    setProductoAEliminar(null)
    setMensaje('')
    setError('')
  }
  function cerrarForm() {
    if (guardando) return
    setFormularioAbierto(false)
    setEditando(null)
  }
  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
    setError('')
  }
  async function guardar(evento) {
    evento.preventDefault()
    if (guardando) return
    setGuardando(true)
    setError('')
    setMensaje('')
    try {
      await guardarProducto({
        datos: formulario, productoActual: editando, usuario, esAdmin,
      })
      setMensaje(editando ? 'Producto actualizado correctamente.' : 'Nuevo producto agregado al catálogo.')
      setFormularioAbierto(false)
      setEditando(null)
      setFormulario(formularioVacio)
    } catch (e) {
      setError(e.message || 'No se pudo guardar el producto.')
    } finally {
      setGuardando(false)
    }
  }
  async function retirar(evento) {
    evento.preventDefault()
    if (!productoAEliminar || guardando) return
    setGuardando(true)
    setError('')
    setMensaje('')
    try {
      await cambiarEstadoProducto({
        producto: productoAEliminar, activo: false,
        motivo, usuario, esAdmin,
      })
      setMensaje('Producto retirado del catálogo. La justificación quedó registrada.')
      setProductoAEliminar(null)
      setMotivo('')
    } catch (e) {
      setError(e.message || 'No se pudo retirar el producto.')
    } finally {
      setGuardando(false)
    }
  }
  async function restaurar(producto) {
    if (guardando) return
    setGuardando(true)
    setError('')
    setMensaje('')
    try {
      await cambiarEstadoProducto({ producto, activo: true, motivo: '', usuario, esAdmin })
      setMensaje('Producto restaurado en el catálogo.')
    } catch (e) {
      setError(e.message || 'No se pudo restaurar el producto.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="admin-productos" aria-labelledby="admin-productos-titulo">
      <header className="admin-productos-header">
        <div>
          <p className="admin-productos-eyebrow">SOLO ADMINISTRADORES</p>
          <h2 id="admin-productos-titulo">GESTIÓN DE PRODUCTOS</h2>
          <p>Agregá, modificá o retirálos. Los clientes únicamente pueden consultar el catálogo.</p>
        </div>
        <button type="button" className="admin-productos-principal" onClick={abrirNuevo}
          disabled={guardando || !firebaseConfigurado || Boolean(errorCatalogo)}>
          <Plus size={18} /> AGREGAR PRODUCTO
        </button>
      </header>

      {!firebaseConfigurado && (
        <p className="admin-productos-error" role="alert">
          Firebase no está configurado. Completá .env.local para habilitar la administración.
        </p>
      )}
      {errorCatalogo && <p className="admin-productos-error" role="alert">{errorCatalogo}</p>}
      {mensaje && <p className="admin-productos-exito" role="status">{mensaje}</p>}
      {error && <p className="admin-productos-error" role="alert">{error}</p>}

      <div className="admin-productos-tabla" aria-label="Administrar modelos activos">
        {activos.map((producto) => (
          <article className="admin-productos-fila" key={producto.sku}>
            <img src={producto.imagen} alt="" />
            <div className="admin-productos-resumen">
              <strong>{producto.nombre}</strong>
              <span>{producto.modelo} · {formatoPrecio(producto.precio)}</span>
            </div>
            <div className="admin-productos-acciones">
              <button type="button" onClick={() => abrirEdicion(producto)}
                disabled={guardando || !firebaseConfigurado || Boolean(errorCatalogo)}>
                <Pencil size={16} /> Editar
              </button>
              <button type="button" className="admin-productos-peligro"
                disabled={guardando || !firebaseConfigurado || Boolean(errorCatalogo)}
                onClick={() => {
                  setProductoAEliminar(producto)
                  setMotivo('')
                  setFormularioAbierto(false)
                  setError('')
                }}>
                <Trash2 size={16} /> Retirar
              </button>
            </div>
          </article>
        ))}
      </div>

      {formularioAbierto && (
        <section className="admin-productos-formulario" aria-label={editando ? 'Editar producto' : 'Agregar producto'}>
          <header className="admin-productos-form-header">
            <h3>{editando ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}</h3>
            <button type="button" onClick={cerrarForm} disabled={guardando} aria-label="Cerrar formulario"><X size={18}/></button>
          </header>
          <form onSubmit={guardar}>
            <div className="admin-productos-grid">
              <label>Nombre de la zapatilla
                <input name="nombre" value={formulario.nombre} onChange={cambiarCampo}
                  required minLength={3} maxLength={100} placeholder="Big Foot Nuevo Modelo" />
              </label>
              <label>Modelo o colección
                <input name="modelo" value={formulario.modelo} onChange={cambiarCampo}
                  required minLength={2} maxLength={60} placeholder="Edición cancha" />
              </label>
              <label>Precio en pesos (ARS)
                <input type="number" name="precio" value={formulario.precio} onChange={cambiarCampo}
                  required min="1" max="999999999" step="1" />
              </label>
              <label>URL HTTPS de la imagen
                <input type="url" name="imagenUrl" value={formulario.imagenUrl} onChange={cambiarCampo}
                  required={!editando} placeholder="https://.../zapatilla.png" />
              </label>
            </div>
            <label>Descripción
              <textarea name="descripcion" value={formulario.descripcion}
                onChange={cambiarCampo} maxLength={600} rows={4}
                placeholder="Descripción del producto" />
            </label>
            <p className="admin-productos-ayuda">
              Para modelos nuevos, alojá la imagen en una URL HTTPS pública. En los modelos
              existentes podés dejar el campo vacío para conservar su imagen original.
            </p>
            {(formulario.imagenUrl || editando?.imagen) && (
              <img className="admin-productos-preview"
                src={formulario.imagenUrl || editando?.imagen} alt="Vista previa de la zapatilla" />
            )}
            <div className="admin-productos-botones">
              <button type="button" className="admin-productos-secundario" onClick={cerrarForm} disabled={guardando}>Cancelar</button>
              <button type="submit" className="admin-productos-principal" disabled={guardando}>
                {guardando ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
              </button>
            </div>
          </form>
        </section>
      )}

      {productoAEliminar && (
        <form className="admin-productos-formulario" onSubmit={retirar}>
          <div className="admin-productos-form-header">
            <h3>RETIRAR: {productoAEliminar.nombre}</h3>
            <button type="button" aria-label="Cancelar baja" disabled={guardando}
              onClick={() => setProductoAEliminar(null)}><X size={18}/></button>
          </div>
          <p>El producto desaparecerá del catálogo público. La baja queda registrada para poder restaurarlo.</p>
          <label>Justificación obligatoria
            <textarea value={motivo} onChange={(evento) => setMotivo(evento.target.value)}
              required minLength={10} maxLength={400} rows={3}
              placeholder="Explicá por qué se retira este producto" />
          </label>
          <div className="admin-productos-botones">
            <button type="button" className="admin-productos-secundario"
              onClick={() => setProductoAEliminar(null)} disabled={guardando}>Cancelar</button>
            <button type="submit" className="admin-productos-peligro" disabled={guardando || motivo.trim().length < 10}>
              CONFIRMAR BAJA
            </button>
          </div>
        </form>
      )}

      {archivados.length > 0 && (
        <section className="admin-productos-archivados">
          <h3>PRODUCTOS RETIRADOS ({archivados.length})</h3>
          {archivados.map((producto) => (
            <div className="admin-productos-fila" key={producto.sku}>
              <span className="admin-productos-archivado-nombre">{producto.nombre}</span>
              <span className="admin-productos-motivo">{producto.motivoBaja || 'Sin motivo'}</span>
              <button type="button" className="admin-productos-restaurar"
                disabled={guardando || !firebaseConfigurado || Boolean(errorCatalogo)}
                onClick={() => restaurar(producto)}>
                <RotateCcw size={16} /> Restaurar
              </button>
            </div>
          ))}
        </section>
      )}
    </section>
  )
}
