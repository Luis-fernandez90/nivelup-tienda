// Contexto de sesión, mismo patrón que carrito_context.tsx. El useEffect
// valida el token contra la API y programa el cierre de sesión automático
// cuando vence.
import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Usuario } from '../dominio/tipos'
import { iniciarSesion, obtenerPerfil } from '../infraestructura/auth'
import { borrarSesion, guardarSesion, leerSesion } from '../infraestructura/almacen'

export interface ValorSesion {
  usuario: Usuario | null
  entrar: (usuario: string, clave: string) => Promise<void>
  salir: () => void
}

export const SessionContext = createContext<ValorSesion | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
 // Lee la sesión guardada en localStorage al iniciar, para no pedir login
// de nuevo si recargas la página.
  const [usuario, setUsuario] = useState<Usuario | null>(() => leerSesion())

  async function entrar(nombreUsuario: string, clave: string) {
    const datos = await iniciarSesion(nombreUsuario, clave)
    guardarSesion(datos)
    setUsuario(datos)
  }

  function salir() {
    borrarSesion()
    setUsuario(null)
  }

  useEffect(() => {
    if (!usuario) return

    const controlador = new AbortController()
    const restante = usuario.expiraEn - Date.now()

    if (restante <= 0) {
      borrarSesion()
      setUsuario(null)
      return
    }

    obtenerPerfil(usuario.token, controlador.signal).catch((error) => {
      if (error instanceof DOMException && error.name === 'AbortError') return
      // Si el token no es válido, cerramos sesión.
      borrarSesion()
      setUsuario(null)
    })

    const temporizador = setTimeout(() => {
      borrarSesion()
      setUsuario(null)
    }, restante)

    return () => {
      controlador.abort()
      clearTimeout(temporizador)
    }
  }, [usuario])

  return <SessionContext.Provider value={{ usuario, entrar, salir }}>{children}</SessionContext.Provider>
}
