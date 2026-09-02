// almacen.ts — Clase 7. Leer/guardar la sesión en localStorage, para que
// no se pierda si recargás la página. Separado de session_context.tsx a
// propósito: si mañana la sesión se guardara distinto (una cookie, por
// ejemplo), solo cambiaría este archivo.
import type { Usuario } from '../dominio/tipos'

const CLAVE = 'nivelup_sesion'

// Acá la validación es más estricta que en pedidos.ts: no alcanza con
// "es un array o no" — hay que confirmar que cada CAMPO tiene el tipo que
// esperamos, porque `localStorage.getItem` le puede devolver a TypeScript
// cualquier cosa (`unknown`, en la práctica) y nosotros necesitamos
// confiar en el `token` y el `expiraEn` para que el resto del código
// funcione. Si algo no calza, devolvemos null — sesión inválida, mejor
// pedir login de nuevo que confiar en datos corruptos.
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
