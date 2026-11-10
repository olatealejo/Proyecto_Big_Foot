import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from 'firebase/auth'
import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'

import { db, storage } from './firebase'

export async function subirFotoPerfil(uid, archivo) {
  const extension =
    archivo.name.split('.').pop()?.toLowerCase() || 'jpg'
  const ruta =
    `perfiles/${uid}/foto-${Date.now()}.${extension}`
  const referencia = ref(storage, ruta)

  await uploadBytes(referencia, archivo, {
    contentType: archivo.type,
  })

  const url = await getDownloadURL(referencia)

  return { url, ruta }
}

export async function eliminarFotoAnterior(ruta) {
  if (!ruta) {
    return
  }

  try {
    await deleteObject(ref(storage, ruta))
  } catch (error) {
    if (error.code !== 'storage/object-not-found') {
      console.warn(
        'No se pudo eliminar la foto anterior:',
        error,
      )
    }
  }
}

export async function guardarPerfil(usuario, datosPerfil) {
  await updateProfile(usuario, {
    displayName: datosPerfil.nombre,
    photoURL: datosPerfil.fotoURL || null,
  })

  await setDoc(
    doc(db, 'usuarios', usuario.uid),
    {
      ...datosPerfil,
      email: usuario.email || '',
      fechaActualizacion: serverTimestamp(),
    },
    { merge: true },
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

  await reauthenticateWithCredential(usuario, credencial)
  await updatePassword(usuario, contrasenaNueva)
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
      'La sesión es antigua. Cerrá sesión e ingresá nuevamente.',
    'storage/unauthorized':
      'No tenés permiso para subir la imagen.',
    'storage/quota-exceeded':
      'Se alcanzó el límite de almacenamiento.',
    'storage/retry-limit-exceeded':
      'La carga tardó demasiado. Intentá nuevamente.',
  }

  return (
    mensajes[error.code]
    || 'No se pudieron guardar los cambios.'
  )
}
