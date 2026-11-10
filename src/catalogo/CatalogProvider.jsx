import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { CatalogContext } from './CatalogContext'
import { PRODUCTOS } from '../cart/catalogo'
import { combinarCatalogos } from './productosLogica'
import { db, firebaseConfigurado } from '../services/firebase'

export function CatalogProvider({ children }) {
  const [documentos, setDocumentos] = useState([])
  const [cargando, setCargando] = useState(Boolean(db))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!db) return undefined
    const cancelar = onSnapshot(
      collection(db, 'productos'),
      (snapshot) => {
        setDocumentos(snapshot.docs.map((d) => ({ ...d.data(), sku: d.id })))
        setCargando(false)
        setError('')
      },
      () => {
        setError('No se pudo sincronizar el catálogo de Firestore.')
        setCargando(false)
      },
    )
    return cancelar
  }, [])

  const catalogo = useMemo(
    () => combinarCatalogos(PRODUCTOS, documentos),
    [documentos],
  )

  const value = useMemo(
    () => ({
      ...catalogo,
      cargando,
      error,
      firebaseConfigurado,
    }),
    [catalogo, cargando, error],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
