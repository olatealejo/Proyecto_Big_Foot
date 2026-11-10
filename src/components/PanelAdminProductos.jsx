import { useMemo, useState } from 'react'
import {
  ArchiveRestore,
  CircleDollarSign,
  ImagePlus,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
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

const MAXIMO_IMAGENES = 6
const TAMANO_MAXIMO = 5 * 1024 * 1024
const TIPOS_PERMITIDOS = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

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
    imagenes: [],
  }
}

function crearImagenesFormulario(producto) {
  if (!producto.imagenUrl) {
    return []
  }

  return producto.imagenes.map((imagen, indice) => ({
    id: 'existente-' + indice + '-' + imagen.src,
    nombre: imagen.nombre,
    url: imagen.src,
    storagePath: imagen.storagePath || '',
    archivo: null,
    preview: imagen.src,
  }))
}

function liberarPreviews(imagenes) {
  imagenes.forEach((imagen) => {
    if (imagen.archivo && imagen.preview) {
      URL.revokeObjectURL(imagen.preview)
    }
  })
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
  onFiles,
  onImageName,
  onImageRemove,
  onTalleToggle,
  onClose,
  onSubmit,
}) {
  const imagenPrincipal =
    formulario.imagenes[0]?.preview
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
                    placeholder="Big Foot Molino 3"
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
                  placeholder="Texto que aparece debajo del precio"
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
                  placeholder="Materiales, colores y características"
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
              <div className="admin-productos-imagenes-header">
                <div>
                  <h4>Galería del producto</h4>
                  <p>
                    JPG, PNG o WEBP. Hasta {MAXIMO_IMAGENES}
                    {' '}imágenes de 5 MB cada una.
                  </p>
                </div>

                <label className="admin-productos-subir">
                  <Upload aria-hidden="true" />
                  Elegir imágenes
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={onFiles}
                    disabled={
                      guardando
                      || formulario.imagenes.length >= MAXIMO_IMAGENES
                    }
                  />
                </label>
              </div>

              {formulario.imagenes.length > 0 ? (
                <div className="admin-productos-imagenes-grid">
                  {formulario.imagenes.map((imagen, indice) => (
                    <article
                      className="admin-productos-imagen"
                      key={imagen.id}
                    >
                      <div>
                        <img src={imagen.preview} alt="" />
                        {indice === 0 && <span>Principal</span>}
                      </div>

                      <label>
                        Nombre de la vista
                        <input
                          value={imagen.nombre}
                          onChange={(evento) =>
                            onImageName(
                              imagen.id,
                              evento.target.value,
                            )
                          }
                          maxLength="50"
                          placeholder={'Vista ' + (indice + 1)}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => onImageRemove(imagen.id)}
                        disabled={guardando}
                      >
                        <Trash2 aria-hidden="true" />
                        Quitar
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="admin-productos-imagenes-vacio">
                  <ImagePlus aria-hidden="true" />
                  <p>
                    Seleccioná imágenes desde tu computadora.
                    La primera será la portada.
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="admin-productos-preview">
            <span>Vista previa principal</span>
            {imagenPrincipal ? (
              <img
                src={imagenPrincipal}
                alt="Vista previa del producto"
              />
            ) : (
              <div className="admin-productos-preview-vacia">
                <Package aria-hidden="true" />
                <p>La portada aparecerá en este espacio.</p>
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
              ? 'Subiendo y guardando...'
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
          <p>Baja del catálogo</p>
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
        El producto dejará de mostrarse públicamente y podrá
        restaurarse desde esta misma página.
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
    guardando || !firebaseConfigurado

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

  function reemplazarFormulario(nuevoFormulario) {
    liberarPreviews(formulario.imagenes)
    setFormulario(nuevoFormulario)
  }

  function abrirNuevo() {
    setEditando(null)
    reemplazarFormulario(crearFormularioVacio())
    setEditorVisible(true)
    setProductoAEliminar(null)
    limpiarEstado()
    mostrarEditor()
  }

  function abrirEdicion(producto) {
    setEditando(producto)
    reemplazarFormulario({
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
    if (guardando) return

    liberarPreviews(formulario.imagenes)
    setEditorVisible(false)
    setEditando(null)
    setFormulario(crearFormularioVacio())
  }

  function abrirBaja(producto) {
    cerrarEditor()
    setProductoAEliminar(producto)
    setMotivo('')
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

  function agregarArchivos(evento) {
    const archivos = Array.from(evento.target.files || [])
    evento.target.value = ''

    if (archivos.length === 0) return

    if (
      formulario.imagenes.length + archivos.length
      > MAXIMO_IMAGENES
    ) {
      setError(
        'La galería admite hasta '
        + MAXIMO_IMAGENES
        + ' imágenes.',
      )
      return
    }

    const archivoInvalido = archivos.find(
      (archivo) =>
        !TIPOS_PERMITIDOS.has(archivo.type)
        || archivo.size > TAMANO_MAXIMO,
    )

    if (archivoInvalido) {
      setError(
        'Usá imágenes JPG, PNG o WEBP de hasta 5 MB.',
      )
      return
    }

    const nuevas = archivos.map((archivo, indice) => ({
      id:
        'nuevo-'
        + Date.now()
        + '-'
        + indice
        + '-'
        + archivo.name,
      nombre:
        archivo.name.replace(/\.[^.]+$/, '')
        || 'Vista ' + (indice + 1),
      url: '',
      storagePath: '',
      archivo,
      preview: URL.createObjectURL(archivo),
    }))

    setFormulario((actual) => ({
      ...actual,
      imagenes: [...actual.imagenes, ...nuevas],
    }))
    setError('')
  }

  function cambiarNombreImagen(id, nombre) {
    setFormulario((actual) => ({
      ...actual,
      imagenes: actual.imagenes.map((imagen) =>
        imagen.id === id
          ? { ...imagen, nombre }
          : imagen,
      ),
    }))
  }

  function quitarImagen(id) {
    setFormulario((actual) => {
      const imagen = actual.imagenes.find(
        (item) => item.id === id,
      )

      if (imagen?.archivo && imagen.preview) {
        URL.revokeObjectURL(imagen.preview)
      }

      return {
        ...actual,
        imagenes: actual.imagenes.filter(
          (item) => item.id !== id,
        ),
      }
    })
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

    if (guardando) return

    try {
      setGuardando(true)
      limpiarEstado()

      await guardarProducto({
        datos: formulario,
        productoActual: editando,
        usuario,
        esAdmin,
      })

      liberarPreviews(formulario.imagenes)
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

    if (!productoAEliminar || guardando) return

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
    if (guardando) return

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
          Firebase no está configurado.
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
          onFiles={agregarArchivos}
          onImageName={cambiarNombreImagen}
          onImageRemove={quitarImagen}
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
                    {producto.motivoBaja
                      || 'Sin motivo registrado'}
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
