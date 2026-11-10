import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updatePassword,
  updateProfile,
} from 'firebase/auth'
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { db, googleProvider } from './firebase'

function crearError(codigo, mensaje) {
  const error = new Error(mensaje)
  error.code = codigo
  return error
}

function conTiempoMaximo(promesa, milisegundos = 15000) {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) => {
      setTimeout(() => {
        rechazar(
          crearError(
            'perfil/tiempo-agotado',
            'La operación tardó demasiado.',
          ),
        )
      }, milisegundos)
    }),
  ])
}

function leerArchivo(archivo) {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader()

    lector.onload = () => resolver(lector.result)
    lector.onerror = () =>
      rechazar(
        crearError(
          'perfil/imagen-invalida',
          'No se pudo leer la imagen.',
        ),
      )

    lector.readAsDataURL(archivo)
  })
}

function cargarImagen(origen) {
  return new Promise((resolver, rechazar) => {
    const imagen = new Image()

    imagen.onload = () => resolver(imagen)
    imagen.onerror = () =>
      rechazar(
        crearError(
          'perfil/imagen-invalida',
          'No se pudo procesar la imagen.',
        ),
      )

    imagen.src = origen
  })
}

export async function procesarFotoPerfil(archivo) {
  const origen = await leerArchivo(archivo)
  const imagen = await cargarImagen(origen)
  const limite = 320
  const escala = Math.min(
    1,
    limite / imagen.naturalWidth,
    limite / imagen.naturalHeight,
  )

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(
    1,
    Math.round(imagen.naturalWidth * escala),
  )
  canvas.height = Math.max(
    1,
    Math.round(imagen.naturalHeight * escala),
  )

  const contexto = canvas.getContext('2d')
  contexto.drawImage(
    imagen,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const fotoComprimida = canvas.toDataURL(
    'image/webp',
    0.8,
  )

  if (fotoComprimida.length > 650000) {
    throw crearError(
      'perfil/foto-demasiado-grande',
      'La imagen procesada sigue siendo demasiado grande.',
    )
  }

  return fotoComprimida
}

export async function guardarPerfil(usuario, datosPerfil) {
  await conTiempoMaximo(
    updateProfile(usuario, {
      displayName: datosPerfil.nombre,
    }),
  )

  await conTiempoMaximo(
    setDoc(
      doc(db, 'usuarios', usuario.uid),
      {
        ...datosPerfil,
        email: usuario.email || '',
        fechaActualizacion: serverTimestamp(),
      },
      { merge: true },
    ),
  )
}

export async function cambiarContrasena({
  usuario,
  contrasenaActual,
  contrasenaNueva,
}) {
  const credencial = EmailAuthProvider.credential(
    usuario.email,
    contrasenaActual,
  )

  await conTiempoMaximo(
    reauthenticateWithCredential(usuario, credencial),
  )
  await conTiempoMaximo(
    updatePassword(usuario, contrasenaNueva),
  )
}

export async function eliminarCuenta({
  usuario,
  confirmacion,
  usaContrasena,
}) {
  if (usaContrasena) {
    const credencial = EmailAuthProvider.credential(
      usuario.email,
      confirmacion,
    )

    await conTiempoMaximo(
      reauthenticateWithCredential(usuario, credencial),
    )
  } else {
    const correoIngresado = confirmacion.trim().toLowerCase()
    const correoUsuario = (usuario.email || '').toLowerCase()

    if (correoIngresado !== correoUsuario) {
      throw crearError(
        'perfil/correo-no-coincide',
        'El correo ingresado no coincide.',
      )
    }

    await conTiempoMaximo(
      reauthenticateWithPopup(usuario, googleProvider),
      30000,
    )
  }

  await conTiempoMaximo(
    deleteDoc(doc(db, 'usuarios', usuario.uid)),
  )
  await conTiempoMaximo(deleteUser(usuario))
}

export function obtenerMensajeErrorPerfil(error) {
  const mensajes = {
    'auth/invalid-credential':
      'La contraseña actual es incorrecta.',
    'auth/wrong-password':
      'La contraseña actual es incorrecta.',
    'auth/weak-password':
      'La nueva contraseña es demasiado débil.',
    'auth/requires-recent-login':
      'La sesión es antigua. Volvé a autenticarte para continuar.',
    'auth/popup-closed-by-user':
      'Se cerró la ventana de Google antes de confirmar.',
    'auth/cancelled-popup-request':
      'La verificación con Google fue cancelada.',
    'auth/network-request-failed':
      'No se pudo conectar con Firebase.',
    'auth/too-many-requests':
      'Hubo demasiados intentos. Esperá unos minutos.',
    'perfil/correo-no-coincide':
      'El correo ingresado no coincide con tu cuenta.',
    'permission-denied':
      'Firestore rechazó la operación. Revisá y publicá las reglas.',
    unavailable:
      'No se pudo conectar con Firebase.',
    'perfil/foto-demasiado-grande':
      'La imagen es demasiado grande para el perfil.',
    'perfil/imagen-invalida':
      'No se pudo procesar la imagen seleccionada.',
    'perfil/tiempo-agotado':
      'Firebase tardó demasiado en responder. Revisá la conexión y las reglas.',
  }

  return (
    mensajes[error.code]
    || 'No se pudo completar la operación.'
  )
}
