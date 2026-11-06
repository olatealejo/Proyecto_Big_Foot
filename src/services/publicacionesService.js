import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const publicacionesRef = collection(db, 'publicaciones')

export async function obtenerPublicaciones() {
    
  try {
    const resultado = await getDocs(publicacionesRef)

    

    return resultado.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }))
  } catch (error) {
    console.error('Error al obtener publicaciones:', error)
    throw error
  }
}
export async function crearPublicacion(datosPublicacion) {
  const nuevaPublicacion = {
    ...datosPublicacion,
    fechaCreacion: serverTimestamp(),
    votos: 0,
    comentarios: 0,
  }

  const documentoCreado = await addDoc(
    publicacionesRef,
    nuevaPublicacion,
  )

  return {
    id: documentoCreado.id,
    ...nuevaPublicacion,
  }
}