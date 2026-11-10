import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../services/firebase'
import { obtenerOCrearPerfil } from '../services/usuariosService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cancelarObservador = onAuthStateChanged(
      auth,
      async (usuarioFirebase) => {
        setCargando(true)

        try {
          if (!usuarioFirebase) {
            setUsuario(null)
            setPerfil(null)
            return
          }

          const perfilFirestore =
            await obtenerOCrearPerfil(usuarioFirebase)

          setUsuario(usuarioFirebase)
          setPerfil(perfilFirestore)
        } catch (error) {
          console.error(
            'No se pudo cargar el perfil del usuario:',
            error,
          )
          setUsuario(usuarioFirebase)
          setPerfil(null)
        } finally {
          setCargando(false)
        }
      },
    )

    return cancelarObservador
  }, [])

  const valor = useMemo(
    () => ({
      usuario,
      perfil,
      esAdmin: perfil?.rol === 'admin',
      cargando,
    }),
    [usuario, perfil, cargando],
  )

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider.',
    )
  }

  return contexto
}
