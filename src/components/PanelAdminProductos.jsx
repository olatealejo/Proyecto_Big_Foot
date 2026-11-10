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

import {
  formatoPrecio,
  TALLES,
} from '../cart/catalogo'
import { useCatalog } from '../catalogo/useCatalog'
import { useAuth } from '../context/AuthContext'
import {
  cambiarEstadoProducto,
  guardarProducto,
} from '../services/productosService'
import './PanelAdminProductos.css'

const NOMBRES_VISTAS = [
  'Vista principal',
  'Lateral derecha',
  'Vista diagonal',
  'Vista superior',
  'Vista trasera',
  'Suela',
]

function crearFormularioVacio() {
  return {
    nombre: '',
    modelo: '',
    categoria: '',
    subtitulo: '',
    precio: '',
    descripcion: '',
    descripcionCompleta: '',
    talles: [...TALLES],
    imagenes: NOMBRES_VISTAS.map((nombre) => ({
      nombre,
      url: '',
    })),
  }
}

function crearImagenesFormulario(producto) {
  const imagenesRemotas = producto.imagenUrl
    ? producto.imagenes
    : []

  return NOMBRES_VISTAS.map((nombre, indice) => ({
    nombre: imagenesRemotas[indice]?.nombre || nombre,
    url: imagenesRemotas[indice]?.src || '',
  }))
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
  onImagenChange,
  onTalleToggle,
  onClose,
  onSubmit,
}) {
  const imagenPrevia =
    formulario.imagenes.find((imagen) => imagen.url)?.url
    || editando?.imagen
    || ''

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
              ? 'Modificación de ficha'
              : 'Alta de producto'}
          </p>
          <h3 id="admin-productos-editor-titulo">
            {editando
              ? 'Editar ' + editando.nombre
              : 'Agregar producto completo'}
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
            <section className="admin-productos-subseccion">
              <h4>Información principal</h4>

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
                    placeholder="Molino 3"
                    required
                  />
                </label>

                <label>
                  Categoría visible
                  <input
                    name="categoria"
                    value={formulario.categoria}
                    onChange={onChange}
                    minLength="3"
                    maxLength="80"
                    placeholder="Zapatillas / Molino 3"
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
              </div>

              <label>
                Frase destacada
                <input
                  name="subtitulo"
                  value={formulario.subtitulo}
                  onChange={onChange}
                  maxLength="180"
                  placeholder="Diseño de cancha con identidad propia."
                />
              </label>
            </section>

            <section className="admin-productos-subseccion">
              <h4>Contenido de la ficha</h4>

              <label>
                Descripción breve
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={onChange}
                  maxLength="600"
                  rows="4"
                  placeholder="Resumen que aparece debajo del precio"
                />
                <span className="admin-productos-contador">
                  {formulario.descripcion.length} / 600
                </span>
              </label>

              <label>
                Descripción completa
                <textarea
                  name="descripcionCompleta"
                  value={formulario.descripcionCompleta}
                  onChange={onChange}
                  maxLength="1500"
                  rows="6"
                  placeholder="Detalles, materiales, colores y características"
                />
                <span className="admin-productos-contador">
                  {formulario.descripcionCompleta.length} / 1500
                </span>
              </label>
            </section>

            <fieldset className="admin-productos-subseccion admin-productos-talles">
              <legend>Talles disponibles</legend>
              <div>
                {TALLES.map((talle) => (
                  <button
                    key={talle}
                    type="button"
                    className={
                      formulario.talles.includes(talle)
                        ? 'admin-productos-talle admin-productos-talle-activo'
                        : 'admin-productos-talle'
                    }
                    aria-pressed={formulario.talles.includes(talle)}
                    onClick={() => onTalleToggle(talle)}
                  >
                    {talle}
                  </button>
                ))}
              </div>
            </fieldset>

            <section className="admin-productos-subseccion">
              <h4>Galería de imágenes</h4>
              <div className="admin-productos-galeria-grid">
                {formulario.imagenes.map((imagen, indice) => (
                  <div
                    className="admin-productos-imagen-campo"
                    key={indice}
                  >
                    <strong>Imagen {indice + 1}</strong>
                    <label>
                      Nombre de la vista
                      <input
                        value={imagen.nombre}
                        onChange={(evento) =>
                          onImagenChange(
                            indice,
                            'nombre',
                            evento.target.value,
                          )
                        }
                        maxLength="50"
                        placeholder="Lateral izquierda"
                      />
                    </label>
                    <label>
                      URL HTTPS
                      <input
                        type="url"
                        value={imagen.url}
                        onChange={(evento) =>
                          onImagenChange(
                            indice,
                            'url',
                            evento.target.value,
                          )
                        }
                        placeholder="https://sitio.com/vista.png"
                        required={indice === 0 && !editando}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="admin-productos-preview">
            <span>Vista previa principal</span>
            {imagenPrevia ? (
              <img
                src={imagenPrevia}
                alt="Vista previa del producto"
              />
            ) : (
              <div className="admin-productos-preview-vacia">
                <Package aria-hidden="true" />
                <p>La primera imagen aparecerá en este espacio.</p>
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
              : 'Guardar ficha completa'}
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
    useState(crearFormularioVacio)
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
    setFormulario(crearFormularioVacio())
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
      categoria: producto.categoria || '',
      subtitulo: producto.subtitulo || '',
      precio: String(producto.precio),
      descripcion: producto.descripcion || '',
      descripcionCompleta:
        producto.descripcionCompleta || '',
      talles: [...producto.talles],
      imagenes: crearImagenesFormulario(producto),
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
    setFormulario(crearFormularioVacio())
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

  function cambiarImagen(indice, campo, valor) {
    setFormulario((actual) => ({
      ...actual,
      imagenes: actual.imagenes.map((imagen, posicion) =>
        posicion === indice
          ? { ...imagen, [campo]: valor }
          : imagen,
      ),
    }))
    setError('')
  }

  function alternarTalle(talle) {
    setFormulario((actual) => ({
      ...actual,
      talles: actual.talles.includes(talle)
        ? actual.talles.filter((numero) => numero !== talle)
        : [...actual.talles, talle].sort((a, b) => a - b),
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
      setFormulario(crearFormularioVacio())
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
          onImagenChange={cambiarImagen}
          onTalleToggle={alternarTalle}
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
