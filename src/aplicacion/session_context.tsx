// session_context.tsx — Clase 7. Mismo patrón que carrito_context.tsx:
// un Provider que guarda el estado, y useSesion() (al lado) para leerlo
// desde cualquier componente.
//
// Lo nuevo acá es el useEffect: cada vez que cambia `usuario` (por
// ejemplo, justo después de iniciar sesión), este efecto:
//   1. calcula cuánto falta para que venza el token,
//   2. si ya venció, cierra sesión al toque,
//   3. si no, valida el token contra la API (obtenerPerfil) — por si el
//      servidor lo invalidó por otro motivo — y programa un timeout para
//      cerrar la sesión SOLA justo cuando venza.
// El cleanup (lo que devuelve el efecto) cancela el fetch en curso
// (AbortController) y el timeout pendiente si el componente se
// desmonta o si `usuario` vuelve a cambiar antes de que se disparen.
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
  // Arranca leyendo lo que haya en localStorage — así, si recargás la
  // página con sesión iniciada, no te vuelve a pedir login.
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
      // El token no pasó la validación (venció del lado del servidor,
      // fue revocado, etc.) — cerramos sesión.
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
