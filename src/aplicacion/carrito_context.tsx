// Contexto del carrito: cualquier componente que lo necesite lo lee con
// useCarrito(), sin tener que pasarlo por props desde App.
import { createContext, useEffect, useReducer, useRef, type ReactNode } from 'react'
import type { ItemCarrito, Producto } from '../dominio/tipos'
import { agregarItem, cambiarCantidad, quitarItem, resumenCarrito } from '../dominio/carrito'
import { guardarCarrito, leerCarrito } from '../infraestructura/carrito_almacen'

export interface ValorCarrito {
  items: ItemCarrito[]
  unidades: number
  subtotal: number
  agregar: (producto: Producto) => void
  sumarUno: (id: number) => void
  restarUno: (id: number) => void
  quitar: (id: number) => void
  vaciar: () => void
  deshacer: () => void
}type AccionCarrito =
  | { tipo: 'agregar'; producto: Producto }
  | { tipo: 'sumar' | 'restar' | 'quitar'; id: number }
  | { tipo: 'vaciar' }
  | { tipo: 'restaurar'; anterior: ItemCarrito[] }

function carritoReducer(items: ItemCarrito[], accion: AccionCarrito): ItemCarrito[] {
  switch (accion.tipo) {
    case 'agregar':
      return agregarItem(items, accion.producto)
    case 'sumar':
      return cambiarCantidad(items, accion.id, 1)
    case 'restar':
      return cambiarCantidad(items, accion.id, -1)
    case 'quitar':
      return quitarItem(items, accion.id)
    case 'vaciar':
      return []
    case 'restaurar':
  return accion.anterior
  }
}

// Valor por defecto null para detectar si se usa useCarrito() fuera del Provider.
export const CarritoContext = createContext<ValorCarrito | null>(null)

export function CarritoProvider({ children }: { children: ReactNode }) {
  // Pasamos leerCarrito como función (no leerCarrito()) para que solo se
// lea el localStorage una vez, en el primer render.
  const [items, dispatch] = useReducer(carritoReducer, undefined, leerCarrito)
  const anteriorRef = useRef<ItemCarrito[] | null>(null)

  // Guarda el carrito en localStorage cada vez que cambian los items.
  useEffect(() => {
    guardarCarrito(items)
  }, [items])

  // Cada función guarda el estado anterior en anteriorRef antes de cambiar
// el carrito, para poder deshacer con deshacer().
  function agregar(producto: Producto) {
    anteriorRef.current = items
    dispatch({ tipo: 'agregar', producto })
  }
  function sumarUno(id: number) {
    anteriorRef.current = items
   dispatch({ tipo: 'sumar', id })
  }
  function restarUno(id: number) {
    anteriorRef.current = items
  dispatch({ tipo: 'restar', id })
}
function quitar(id: number) {
  anteriorRef.current = items
  dispatch({ tipo: 'quitar', id })
}
function vaciar() {
  anteriorRef.current = items
  dispatch({ tipo: 'vaciar' })
}
function deshacer() {
  if (anteriorRef.current) {
    dispatch({ tipo: 'restaurar', anterior: anteriorRef.current })
  }
}
  const { unidades, subtotal } = resumenCarrito(items)

  return (
    <CarritoContext.Provider value={{ items, unidades, subtotal, agregar, sumarUno, restarUno, quitar, vaciar, deshacer }}>
      {children}
    </CarritoContext.Provider>
  )
}
