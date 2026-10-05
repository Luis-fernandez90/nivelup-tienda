// Hook para leer el carrito sin repetir el useContext + chequeo de null
// en cada componente que lo necesite.
import { useContext } from 'react'
import { CarritoContext } from './carrito_context'

export default function useCarrito() {
  const valor = useContext(CarritoContext)

  // Si esto se dispara es porque algún componente llamó a useCarrito() fuera
  // de <CarritoProvider>. Tirar el error acá hace que el bug se note en la
  // consola, no que pase en silencio.
  if (valor === null) {
    throw new Error('useCarrito() se usó fuera de <CarritoProvider>')
  }

  return valor
}