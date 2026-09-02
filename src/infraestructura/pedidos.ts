// pedidos.ts — Clase 6. Guardar y leer los pedidos confirmados en
// localStorage. El patrón es siempre el mismo: leer todo, armar una lista
// NUEVA (spread + el nuevo pedido), y volver a guardar todo entero — acá
// no hay servidor todavía, así que localStorage hace de "base de datos".
import type { Pedido } from '../dominio/tipos'

const CLAVE = 'nivelup_pedidos'

// Defensivo a propósito: localStorage puede tener basura (datos de otra
// versión del proyecto, o alguien tocando la consola a mano). Si el JSON
// no es válido, o no es un array, devolvemos [] en vez de romper la app.
export function leerPedidos(): Pedido[] {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return []
    const datos = JSON.parse(crudo)
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

export function guardarPedido(pedido: Pedido): void {
  const actuales = leerPedidos()
  localStorage.setItem(CLAVE, JSON.stringify([...actuales, pedido]))
}
