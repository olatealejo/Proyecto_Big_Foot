import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { db } from './firebase'

export async function obtenerOCrearPerfil(usuarioFirebase) {
  const referenciaUsuario = doc(
    db,
    'usuarios',
    usuarioFirebase.uid,
  )

  const documentoUsuario = await getDoc(referenciaUsuario)

  if (documentoUsuario.exists()) {
    return {
      id: documentoUsuario.id,
      ...documentoUsuario.data(),
    }
  }

  const perfilNuevo = {
    nombre: usuarioFirebase.displayName || 'Usuario',
    email: usuarioFirebase.email || '',
    fotoURL: usuarioFirebase.photoURL || '',
    rol: 'usuario',
    fechaCreacion: serverTimestamp(),
  }

  await setDoc(referenciaUsuario, perfilNuevo)

  return {
    id: usuarioFirebase.uid,
    ...perfilNuevo,
  }
}
