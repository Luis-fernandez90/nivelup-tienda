// CartPanel.tsx — Clase 4 ("Manejo de eventos + useState: carrito con
// estado"). Desde Clase 6 ya NO recibe nada por props: lee el carrito y
// sus acciones directo de useCarrito(). El botón "Ir a pagar" navega a
// /checkout con <Link>.
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import formatearPrecio from '../formato'
import useCarrito from '../../aplicacion/useCarrito'

export default function CartPanel() {
  const { items, subtotal, sumarUno, restarUno, quitar, vaciar } = useCarrito()
const tituloRef = useRef<HTMLHeadingElement>(null)
useEffect(() => {
  tituloRef.current?.focus()
}, [])
  return (
    <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 ref={tituloRef} tabIndex={-1} className="mb-2 font-semibold text-zinc-100">Tu carrito</h2>

      {items.length === 0 && <p className="text-sm text-zinc-500">Tu carrito está vacío.</p>}

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 text-sm text-zinc-200">
            <span className="flex-1">{item.nombre}</span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => restarUno(item.id)}
                aria-label={`Quitar una unidad de ${item.nombre}`}
                className="rounded-full border border-zinc-700 px-2 leading-6"
              >
                −
              </button>
              <span>{item.cantidad}</span>
              <button
                type="button"
                onClick={() => sumarUno(item.id)}
                aria-label={`Agregar una unidad de ${item.nombre}`}
                className="rounded-full border border-zinc-700 px-2 leading-6"
              >
                +
              </button>
              <strong className="w-20 text-right text-violet-400">
                {formatearPrecio(item.precio * item.cantidad)}
              </strong>
              <button
                type="button"
                onClick={() => quitar(item.id)}
                aria-label={`Quitar ${item.nombre} del carrito`}
                className="text-zinc-500 hover:text-red-400"
              >
                ✕
              </button>
            </span>
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-3">
          <button type="button" className="text-sm text-zinc-400 underline" onClick={vaciar}>
            Vaciar carrito
          </button>
          <p className="font-semibold text-zinc-100">Subtotal: {formatearPrecio(subtotal)}</p>
        </div>
      )}

      {items.length > 0 && (
        <Link
          to="/checkout"
          className="mt-3 block rounded-full bg-violet-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-violet-500"
        >
          Ir a pagar
        </Link>
      )}
    </section>
  )
}
