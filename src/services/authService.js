import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth'

import { auth, googleProvider } from './firebase'

export async function iniciarSesionConGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();

  // Envía el token a tu backend de Node.js
  const respuesta = await fetch("http://localhost:5000/api/ruta-protegida", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    }
  });

  
  if (!respuesta.ok) throw new Error("Error de validación en el servidor");
  return await respuesta.json();
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
  }

  return (
    mensajes[error.code] ||
    'No se pudo completar la operación. Intentá nuevamente.'
  )
}
