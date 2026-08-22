// carrito.ts — las reglas del carrito, separadas de la pantalla. Son
// funciones PURAS: reciben la lista de ítems y devuelven una lista NUEVA,
// nunca modifican la que reciben. Esto importa mucho en React: el estado se
// actualiza reemplazándolo (`setCarrito(nuevo)`), no mutándolo — si estas
// funciones mutaran el array original, React podría no darse cuenta de que
// cambió nada y no repintar.
import type { ItemCarrito, Producto } from './tipos'

// Clase 4 ("Carrito con estado"): agregar un producto. Si ya estaba, sube la
// cantidad (con un map + ternario, el mismo patrón del proyecto anterior);
// si no estaba, entra como ítem nuevo con cantidad 1.
export function agregarItem(items: ItemCarrito[], producto: Producto): ItemCarrito[] {
  const existente = items.find((item) => item.id === producto.id)

  if (existente) {
    return items.map((item) =>
      item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
    )
  }

  return [...items, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }]
}

// Sube o baja la cantidad de UN ítem. Si llega a 0, sale del carrito solo
// (el filter de abajo se encarga): bajar a cero ES quitar.
export function cambiarCantidad(items: ItemCarrito[], id: number, delta: number): ItemCarrito[] {
  return items
    .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + delta } : item))
    .filter((item) => item.cantidad > 0)
}

export function quitarItem(items: ItemCarrito[], id: number): ItemCarrito[] {
  return items.filter((item) => item.id !== id)
}

export interface ResumenCarrito {
  unidades: number
  subtotal: number
}

export function resumenCarrito(items: ItemCarrito[]): ResumenCarrito {
  const unidades = items.reduce((suma, item) => suma + item.cantidad, 0)
  const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
  return { unidades, subtotal }
}
