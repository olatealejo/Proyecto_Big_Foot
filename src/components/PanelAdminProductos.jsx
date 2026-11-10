import { useMemo, useState } from 'react'
import {
  ArchiveRestore,
  CircleDollarSign,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'

import { formatoPrecio } from '../cart/catalogo'
import { useCatalog } from '../catalogo/useCatalog'
import { useAuth } from '../context/AuthContext'
import {
  cambiarEstadoProducto,
  guardarProducto,
} from '../services/productosService'
import './PanelAdminProductos.css'

const FORMULARIO_VACIO = {
  nombre: '',
  modelo: '',
  precio: '',
  descripcion: '',
  imagenUrl: '',
}

function ordenarProductos(productos) {
  return [...productos].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es'),
  )
}

function FilaProducto({
  producto,
  deshabilitado,
  onEditar,
  onRetirar,
}) {
  return (
    <article className="admin-productos-fila">
      <img src={producto.imagen} alt="" />

      <div className="admin-productos-resumen">
        <strong>{producto.nombre}</strong>
        <span>{producto.modelo}</span>
      </div>

      <strong className="admin-productos-precio">
        {formatoPrecio(producto.precio)}
      </strong>

      <span className="admin-productos-estado">Activo</span>

      <div className="admin-productos-acciones">
        <button
          type="button"
          onClick={() => onEditar(producto)}
          disabled={deshabilitado}
        >
          <Pencil aria-hidden="true" />
          Editar
        </button>
        <button
          type="button"
          className="admin-productos-peligro"
          onClick={() => onRetirar(producto)}
          disabled={deshabilitado}
        >
          <Trash2 aria-hidden="true" />
          Retirar
        </button>
      </div>
    </article>
  )
}

function FormularioProducto({
  formulario,
  editando,
  guardando,
  onChange,
  onClose,
  onSubmit,
}) {
  const imagenPrevia =
    formulario.imagenUrl || editando?.imagen || ''

  return (
    <section
      id="admin-productos-editor"
      className="admin-productos-editor"
      aria-labelledby="admin-productos-editor-titulo"
    >
      <header className="admin-productos-editor-header">
        <div>
          <p>
            {editando
              ? 'Modificación de inventario'
              : 'Alta de inventario'}
          </p>
          <h3 id="admin-productos-editor-titulo">
            {editando
              ? 'Editar ' + editando.nombre
              : 'Agregar producto'}
          </h3>
        </div>

        <button
          type="button"
          className="admin-productos-cerrar"
          onClick={onClose}
          disabled={guardando}
          aria-label="Cerrar editor"
        >
          <X aria-hidden="true" />
        </button>
      </header>

      <form
        className="admin-productos-formulario"
        onSubmit={onSubmit}
      >
        <div className="admin-productos-formulario-contenido">
          <div className="admin-productos-campos">
            <div className="admin-productos-grid">
              <label>
                Nombre de la zapatilla
                <input
                  name="nombre"
                  value={formulario.nombre}
                  onChange={onChange}
                  minLength="3"
                  maxLength="100"
                  placeholder="Big Foot Nuevo Modelo"
                  required
                />
              </label>

              <label>
                Modelo o colección
                <input
                  name="modelo"
                  value={formulario.modelo}
                  onChange={onChange}
                  minLength="2"
                  maxLength="60"
                  placeholder="Edición cancha"
                  required
                />
              </label>

              <label>
                Precio en pesos
                <input
                  type="number"
                  name="precio"
                  value={formulario.precio}
                  onChange={onChange}
                  min="1"
                  max="999999999"
                  step="1"
                  placeholder="150000"
                  required
                />
              </label>

              <label>
                URL pública de imagen
                <input
                  type="url"
                  name="imagenUrl"
                  value={formulario.imagenUrl}
                  onChange={onChange}
                  placeholder="https://sitio.com/zapatilla.png"
                  required={!editando}
                />
              </label>
            </div>

            <label>
              Descripción del producto
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={onChange}
                maxLength="600"
                rows="6"
                placeholder="Características, materiales y estilo del modelo"
              />
              <span className="admin-productos-contador">
                {formulario.descripcion.length} / 600
              </span>
            </label>
          </div>

          <aside className="admin-productos-preview">
            <span>Vista previa</span>
            {imagenPrevia ? (
              <img
                src={imagenPrevia}
                alt="Vista previa del producto"
              />
            ) : (
              <div className="admin-productos-preview-vacia">
                <Package aria-hidden="true" />
                <p>La imagen aparecerá en este espacio.</p>
              </div>
            )}
          </aside>
        </div>

        <div className="admin-productos-botones">
          <button
            type="button"
            className="admin-productos-secundario"
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="admin-productos-principal"
            disabled={guardando}
          >
            {guardando
              ? 'Guardando...'
              : 'Guardar producto'}
          </button>
        </div>
      </form>
    </section>
  )
}

function ConfirmacionBaja({
  producto,
  motivo,
  guardando,
  onMotivo,
  onCancel,
  onSubmit,
}) {
  return (
    <form
      className="admin-productos-baja"
      onSubmit={onSubmit}
    >
      <header>
        <div>
          <p>Baja lógica</p>
          <h3>Retirar {producto.nombre}</h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={guardando}
          aria-label="Cancelar baja"
        >
          <X aria-hidden="true" />
        </button>
      </header>

      <p>
        El producto dejará de mostrarse públicamente, pero podrá
        restaurarse desde este panel.
      </p>

      <label>
        Justificación obligatoria
        <textarea
          value={motivo}
          onChange={(evento) => onMotivo(evento.target.value)}
          minLength="10"
          maxLength="400"
          rows="4"
          placeholder="Explicá el motivo de la baja"
          required
        />
      </label>

      <div className="admin-productos-botones">
        <button
          type="button"
          className="admin-productos-secundario"
          onClick={onCancel}
          disabled={guardando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="admin-productos-peligro"
          disabled={guardando || motivo.trim().length < 10}
        >
          Confirmar baja
        </button>
      </div>
    </form>
  )
}

export default function PanelAdminProductos() {
  const {
    usuario,
    esAdmin,
    cargando: cargandoSesion,
  } = useAuth()
  const {
    productos,
    archivados,
    firebaseConfigurado,
    error: errorCatalogo,
  } = useCatalog()

  const [editorVisible, setEditorVisible] = useState(false)
  const [formulario, setFormulario] =
    useState(FORMULARIO_VACIO)
  const [editando, setEditando] = useState(null)
  const [productoAEliminar, setProductoAEliminar] =
    useState(null)
  const [motivo, setMotivo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const activos = useMemo(
    () => ordenarProductos(Object.values(productos)),
    [productos],
  )
  const retirados = useMemo(
    () => ordenarProductos(archivados),
    [archivados],
  )
  const valorCatalogo = useMemo(
    () => activos.reduce(
      (total, producto) => total + producto.precio,
      0,
    ),
    [activos],
  )

  if (cargandoSesion || !esAdmin) {
    return null
  }

  const accionesDeshabilitadas =
    guardando
    || !firebaseConfigurado
    || Boolean(errorCatalogo)

  function mostrarEditor() {
    requestAnimationFrame(() => {
      document
        .getElementById('admin-productos-editor')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    })
  }

  function limpiarEstado() {
    setMensaje('')
    setError('')
  }

  function abrirNuevo() {
    setEditando(null)
    setFormulario({ ...FORMULARIO_VACIO })
    setEditorVisible(true)
    setProductoAEliminar(null)
    limpiarEstado()
    mostrarEditor()
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
    setEditorVisible(true)
    setProductoAEliminar(null)
    limpiarEstado()
    mostrarEditor()
  }

  function cerrarEditor() {
    if (guardando) {
      return
    }

    setEditorVisible(false)
    setEditando(null)
    setFormulario(FORMULARIO_VACIO)
  }

  function abrirBaja(producto) {
    setProductoAEliminar(producto)
    setMotivo('')
    setEditorVisible(false)
    setEditando(null)
    limpiarEstado()
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }))
    setError('')
  }

  async function guardar(evento) {
    evento.preventDefault()

    if (guardando) {
      return
    }

    try {
      setGuardando(true)
      limpiarEstado()

      await guardarProducto({
        datos: formulario,
        productoActual: editando,
        usuario,
        esAdmin,
      })

      setMensaje(
        editando
          ? 'Producto actualizado correctamente.'
          : 'Producto agregado correctamente.',
      )
      setEditorVisible(false)
      setEditando(null)
      setFormulario(FORMULARIO_VACIO)
    } catch (err) {
      setError(
        err.message || 'No se pudo guardar el producto.',
      )
    } finally {
      setGuardando(false)
    }
  }

  async function retirar(evento) {
    evento.preventDefault()

    if (!productoAEliminar || guardando) {
      return
    }

    try {
      setGuardando(true)
      limpiarEstado()

      await cambiarEstadoProducto({
        producto: productoAEliminar,
        activo: false,
        motivo,
        usuario,
        esAdmin,
      })

      setMensaje(
        'Producto retirado. La justificación quedó registrada.',
      )
      setProductoAEliminar(null)
      setMotivo('')
    } catch (err) {
      setError(
        err.message || 'No se pudo retirar el producto.',
      )
    } finally {
      setGuardando(false)
    }
  }

  async function restaurar(producto) {
    if (guardando) {
      return
    }

    try {
      setGuardando(true)
      limpiarEstado()

      await cambiarEstadoProducto({
        producto,
        activo: true,
        motivo: '',
        usuario,
        esAdmin,
      })
      setMensaje('Producto restaurado en el catálogo.')
    } catch (err) {
      setError(
        err.message || 'No se pudo restaurar el producto.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section
      className="admin-productos"
      aria-labelledby="admin-productos-titulo"
    >
      <header className="admin-productos-header">
        <div>
          <p className="admin-productos-eyebrow">
            Inventario central
          </p>
          <h2 id="admin-productos-titulo">
            Productos
          </h2>
        </div>

        <button
          type="button"
          className="admin-productos-principal"
          onClick={abrirNuevo}
          disabled={accionesDeshabilitadas}
        >
          <Plus aria-hidden="true" />
          Agregar producto
        </button>
      </header>

      <div className="admin-productos-metricas">
        <article>
          <Package aria-hidden="true" />
          <div>
            <span>Modelos activos</span>
            <strong>{activos.length}</strong>
          </div>
        </article>
        <article>
          <ArchiveRestore aria-hidden="true" />
          <div>
            <span>Modelos retirados</span>
            <strong>{retirados.length}</strong>
          </div>
        </article>
        <article>
          <CircleDollarSign aria-hidden="true" />
          <div>
            <span>Valor combinado</span>
            <strong>{formatoPrecio(valorCatalogo)}</strong>
          </div>
        </article>
      </div>

      {!firebaseConfigurado && (
        <p className="admin-productos-error" role="alert">
          Firebase no está configurado. Completá las variables de
          entorno para administrar el catálogo.
        </p>
      )}
      {errorCatalogo && (
        <p className="admin-productos-error" role="alert">
          {errorCatalogo}
        </p>
      )}
      {mensaje && (
        <p className="admin-productos-exito" role="status">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="admin-productos-error" role="alert">
          {error}
        </p>
      )}

      {editorVisible && (
        <FormularioProducto
          formulario={formulario}
          editando={editando}
          guardando={guardando}
          onChange={cambiarCampo}
          onClose={cerrarEditor}
          onSubmit={guardar}
        />
      )}

      {productoAEliminar && (
        <ConfirmacionBaja
          producto={productoAEliminar}
          motivo={motivo}
          guardando={guardando}
          onMotivo={setMotivo}
          onCancel={() => setProductoAEliminar(null)}
          onSubmit={retirar}
        />
      )}

      <section className="admin-productos-inventario">
        <header>
          <div>
            <p>Catálogo público</p>
            <h3>Inventario activo</h3>
          </div>
          <span>{activos.length} productos</span>
        </header>

        <div className="admin-productos-columnas">
          <span>Producto</span>
          <span>Precio</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        <div className="admin-productos-tabla">
          {activos.length > 0 ? (
            activos.map((producto) => (
              <FilaProducto
                key={producto.sku}
                producto={producto}
                deshabilitado={accionesDeshabilitadas}
                onEditar={abrirEdicion}
                onRetirar={abrirBaja}
              />
            ))
          ) : (
            <p className="admin-productos-vacio">
              No hay productos activos.
            </p>
          )}
        </div>
      </section>

      <section className="admin-productos-archivados">
        <header>
          <div>
            <p>Historial recuperable</p>
            <h3>Productos retirados</h3>
          </div>
          <span>{retirados.length} productos</span>
        </header>

        {retirados.length > 0 ? (
          <div className="admin-productos-archivados-lista">
            {retirados.map((producto) => (
              <article
                className="admin-productos-archivado"
                key={producto.sku}
              >
                <div>
                  <strong>{producto.nombre}</strong>
                  <span>
                    {producto.motivoBaja || 'Sin motivo registrado'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => restaurar(producto)}
                  disabled={accionesDeshabilitadas}
                >
                  <RotateCcw aria-hidden="true" />
                  Restaurar
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-productos-vacio">
            No hay productos retirados.
          </p>
        )}
      </section>
    </section>
  )
}
