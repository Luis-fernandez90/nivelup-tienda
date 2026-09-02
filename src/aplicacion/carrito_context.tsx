// carrito_context.tsx — Clase 6 ("Context API"). Hasta acá, `carrito` vivía
// como useState en App, y bajaba a los demás componentes por props (Header,
// CartPanel, ProductCard...). A medida que la tienda crece, ese "prop
// drilling" se vuelve incómodo: un componente que ni usa el carrito lo
// termina recibiendo solo para pasarlo más abajo. Context resuelve esto:
// cualquier componente que lo necesite lo lee directo con useCarrito() (el
// hook de al lado), sin que nadie en el medio tenga que saber que existe.
import { createContext, useEffect, useState, type ReactNode } from 'react'
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
}

// OJO: el valor por defecto es `null`, no un objeto "vacío" inventado. Así,
// si algún componente llega a usar useCarrito() SIN estar envuelto en el
// Provider, el hook lo puede detectar y avisar con un error claro, en vez
// de fallar en silencio con datos falsos.
export const CarritoContext = createContext<ValorCarrito | null>(null)

export function CarritoProvider({ children }: { children: ReactNode }) {
  // El inicializador de useState es una FUNCIÓN (no `leerCarrito()` directo)
  // a propósito: así solo se lee el localStorage una vez, en el primer
  // render, y no en cada render que haga este componente.
  const [items, setItems] = useState<ItemCarrito[]>(() => leerCarrito())

  // Mundo de afuera = localStorage, así que va en un useEffect, nunca
  // directo en el render. Corre después de cada render en el que `items`
  // cambió (es la única dependencia) y guarda una copia fresca. Si guardar
  // falla, `guardarCarrito` ya se encarga de no romper nada.
  useEffect(() => {
    guardarCarrito(items)
  }, [items])

  // Las mismas funciones puras de carrito.ts (Clase 4), ahora llamadas
  // desde acá en vez de desde App: la LÓGICA no cambió, solo se mudó DÓNDE
  // vive el estado.
  function agregar(producto: Producto) {
    setItems(agregarItem(items, producto))
  }
  function sumarUno(id: number) {
    setItems(cambiarCantidad(items, id, 1))
  }
  function restarUno(id: number) {
    setItems(cambiarCantidad(items, id, -1))
  }
  function quitar(id: number) {
    setItems(quitarItem(items, id))
  }
  function vaciar() {
    setItems([])
  }

  const { unidades, subtotal } = resumenCarrito(items)

  return (
    <CarritoContext.Provider value={{ items, unidades, subtotal, agregar, sumarUno, restarUno, quitar, vaciar }}>
      {children}
    </CarritoContext.Provider>
  )
}
