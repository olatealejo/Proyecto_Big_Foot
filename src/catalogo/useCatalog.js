import { useContext } from 'react'
import { CatalogContext } from './CatalogContext'
export function useCatalog() {
  const value = useContext(CatalogContext)
  if (!value) throw new Error('useCatalog necesita CatalogProvider')
  return value
}
