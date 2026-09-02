// useCarrito.ts — Clase 6. Un "custom hook" es, ni más ni menos, una
// función que empieza con `use` y usa otros hooks adentro (acá,
// useContext). Sirve para no repetir en cada componente el mismo
// `useContext(CarritoContext)` más la comprobación de null.
import { useContext } from 'react'
import { CarritoContext } from './carrito_context'

export default function useCarrito() {
  const valor = useContext(CarritoContext)

  // Si esto se dispara, es porque algún componente usó useCarrito() por
  // fuera de <CarritoProvider>. Tirar el error acá (en vez de dejar pasar
  // datos vacíos o `undefined`) hace el bug imposible de ignorar en
  // silencio — se ve enseguida en la consola, apenas pasa.
  if (valor === null) {
    throw new Error('useCarrito() se usó fuera de <CarritoProvider>')
  }

  return valor
}
