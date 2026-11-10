import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth'

import { auth, googleProvider } from './firebase'

export async function iniciarSesionConGoogle() {
  const credencial = await signInWithPopup(auth, googleProvider)

  return credencial.user
}

export async function registrarUsuario({
  nombre,
  correo,
  contrasena,
}) {
  const credencial = await createUserWithEmailAndPassword(
    auth,
    correo,
    contrasena,
  )

  await updateProfile(credencial.user, {
    displayName: nombre,
  })

  return credencial.user
}

export async function iniciarSesion({ correo, contrasena }) {
  const credencial = await signInWithEmailAndPassword(
    auth,
    correo,
    contrasena,
  )

  return credencial.user
}

export function obtenerMensajeErrorAuth(error) {
  const mensajes = {
    'auth/email-already-in-use':
      'Ya existe una cuenta registrada con ese correo.',
    'auth/invalid-email':
      'El correo electrónico no tiene un formato válido.',
    'auth/weak-password':
      'La contraseña es demasiado débil.',
    'auth/invalid-credential':
      'El correo o la contraseña son incorrectos.',
    'auth/user-disabled':
      'Esta cuenta fue deshabilitada.',
    'auth/too-many-requests':
      'Se realizaron demasiados intentos. Probá nuevamente más tarde.',
    'auth/network-request-failed':
      'No se pudo conectar con Firebase. Revisá la conexión a Internet.',
    'auth/popup-closed-by-user':
      'Se cerró la ventana de Google antes de completar el ingreso.',
    'auth/popup-blocked':
      'El navegador bloqueó la ventana de Google. Habilitá las ventanas emergentes.',
    'auth/cancelled-popup-request':
      'Se canceló el intento anterior. Volvé a intentarlo.',
    'auth/account-exists-with-different-credential':
      'Ya existe una cuenta con ese correo y otro método de ingreso.',
    'auth/unauthorized-domain':
      'Este dominio no está autorizado en Firebase Authentication.',
  }

  return (
    mensajes[error.code] ||
    'No se pudo completar la operación. Intentá nuevamente.'
  )
}
