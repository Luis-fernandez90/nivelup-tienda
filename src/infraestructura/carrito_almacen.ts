// carrito_almacen.ts — Clase 6 (useEffect + localStorage): el carrito
// sobrevive a un F5. Antes, `items` vivía solo en memoria (useState) — al
// recargar la página, se perdía todo. Separado del Context a propósito,
// igual que almacen.ts hace con la sesión: si mañana el carrito se
// guardara distinto (una cookie, el backend), solo cambia este archivo.
import type { ItemCarrito } from '../dominio/tipos'

const CLAVE = 'nivelup_carrito'

// Igual que con la sesión: no alcanza "es un array o no" — cada ítem tiene
// que tener la forma que esperamos. Si algo no calza (por ejemplo, alguien
// editó el localStorage a mano), lo descartamos en vez de romper el carrito.
export function leerCarrito(): ItemCarrito[] {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return []

    const datos = JSON.parse(crudo)
    if (!Array.isArray(datos)) return []

    return datos.filter(
      (item): item is ItemCarrito =>
        typeof item?.id === 'number' &&
        typeof item?.nombre === 'string' &&
        typeof item?.precio === 'number' &&
        typeof item?.cantidad === 'number',
    )
  } catch {
    return []
  }
}

// El localStorage puede fallar (modo incógnito con cuota en cero, disco
// lleno, etcétera) — nunca debería tirar abajo la tienda por eso. Si falla,
// avisamos por consola y seguimos: el carrito sigue funcionando en memoria
// para esta sesión, simplemente no sobrevive al próximo F5.
export function guardarCarrito(items: ItemCarrito[]): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(items))
  } catch (error) {
    console.warn('No se pudo guardar el carrito.', error instanceof Error ? error.message : error)
  }
}
