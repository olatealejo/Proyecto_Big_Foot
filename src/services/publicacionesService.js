import { collection, getDocs } from 'firebase/firestore'
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