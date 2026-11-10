import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'

import { db } from './firebase'

const publicacionesRef = collection(db, 'publicaciones')
const moderacionesRef = collection(db, 'moderaciones')

export async function obtenerPublicaciones() {
  try {
    const resultado = await getDocs(publicacionesRef)

    return resultado.docs
      .map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }))
      .sort((a, b) => {
        const fechaA = a.fechaCreacion?.toMillis?.() || 0
        const fechaB = b.fechaCreacion?.toMillis?.() || 0

        return fechaB - fechaA
      })
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

export async function actualizarPublicacion(
  publicacionId,
  datosPublicacion,
) {
  const referencia = doc(db, 'publicaciones', publicacionId)
  const publicacionActualizada = {
    ...datosPublicacion,
    fechaActualizacion: serverTimestamp(),
  }

  await updateDoc(referencia, publicacionActualizada)

  return {
    id: publicacionId,
    ...publicacionActualizada,
  }
}

export async function eliminarPublicacionConJustificacion({
  publicacion,
  administrador,
  justificacion,
}) {
  const referenciaPublicacion = doc(
    db,
    'publicaciones',
    publicacion.id,
  )
  const referenciaModeracion = doc(moderacionesRef)
  const lote = writeBatch(db)

  lote.set(referenciaModeracion, {
    publicacionId: publicacion.id,
    autorId: publicacion.autorId || null,
    autor: publicacion.autor || 'Usuario',
    titulo: publicacion.titulo || '',
    contenido: publicacion.contenido || '',
    justificacion,
    administradorId: administrador.uid,
    administradorEmail: administrador.email || '',
    administradorNombre:
      administrador.displayName || administrador.email || 'Administrador',
    fechaCreacion: serverTimestamp(),
  })

  lote.delete(referenciaPublicacion)

  await lote.commit()

  return referenciaModeracion.id
}
