// useSesion.ts — Clase 7. Mismo patrón que useCarrito.ts: lee el
// SessionContext y tira un error claro si se usa fuera de <SessionProvider>.
import { useContext } from 'react'
import { SessionContext } from './session_context'

export default function useSesion() {
  const valor = useContext(SessionContext)

  if (valor === null) {
    throw new Error('useSesion() se usó fuera de <SessionProvider>')
  }

  return valor
}
