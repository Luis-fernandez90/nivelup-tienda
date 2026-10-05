// Guardar y leer los pedidos confirmados en localStorage. No hay servidor
// todavía, así que localStorage hace de "base de datos": leo todo, armo
// una lista nueva con el pedido agregado, y guardo todo de nuevo.
import type { Pedido } from '../dominio/tipos'

const CLAVE = 'nivelup_pedidos'

// Defensivo a propósito: localStorage puede tener basura (de otra versión
// del proyecto, o de alguien tocando la consola). Si el JSON no es válido
// o no es un array, devuelvo [] en vez de romper la app.
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