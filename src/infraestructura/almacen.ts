// Leer/guardar la sesión en localStorage, para que no se pierda si
// recargas la página. Separado de session_context.tsx a propósito: si
// mañana la sesión se guardara distinto (una cookie, por ejemplo), solo
// cambiaría este archivo.
import type { Usuario } from '../dominio/tipos'

const CLAVE = 'nivelup_sesion'

// Acá la validación es más estricta que en pedidos.ts: no alcanza con
// saber si es un array, hay que confirmar que cada campo tiene el tipo
// esperado (localStorage.getItem le devuelve a TypeScript básicamente
// unknown). Si algo no calza, devuelvo null — mejor pedir login de nuevo
// que confiar en datos corruptos.
export function leerSesion(): Usuario | null {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return null

    const datos = JSON.parse(crudo)
    if (typeof datos !== 'object' || datos === null) return null
    if (typeof datos.token !== 'string' || typeof datos.expiraEn !== 'number') return null

    return datos as Usuario
  } catch {
    return null
  }
}

export function guardarSesion(usuario: Usuario): void {
  localStorage.setItem(CLAVE, JSON.stringify(usuario))
}

export function borrarSesion(): void {
  localStorage.removeItem(CLAVE)
}