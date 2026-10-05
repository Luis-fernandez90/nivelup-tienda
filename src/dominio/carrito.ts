// Reglas del carrito, separadas de la pantalla. Son funciones puras: no
// modifican el array que reciben, devuelven uno nuevo (si mutara el
// original, React podría no darse cuenta del cambio y no repintar).
import type { ItemCarrito, Producto } from './tipos'

// Si el producto ya estaba en el carrito, sube la cantidad. Si no, entra
// como ítem nuevo con cantidad 1.
export function agregarItem(items: ItemCarrito[], producto: Producto): ItemCarrito[] {
  const existente = items.find((item) => item.id === producto.id)

  if (existente) {
    return items.map((item) =>
      item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
    )
  }

  return [...items, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }]
}

// Sube o baja la cantidad de un ítem. Si llega a 0, el filter de abajo lo
// saca del carrito.
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