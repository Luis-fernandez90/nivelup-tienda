// CartPanel.tsx — Clase 4 ("Manejo de eventos + useState: carrito con
// estado"). Este componente NO tiene su propio useState: recibe los ítems
// ya calculados y avisa lo que pasa (quitar, sumar, restar, vaciar) por
// props. El estado real vive en App — acá solo se PINTA y se avisa.
import formatearPrecio from '../formato'
import type { ItemCarrito } from '../tipos'

interface Props {
  items: ItemCarrito[]
  onSumar: (id: number) => void
  onRestar: (id: number) => void
  onQuitar: (id: number) => void
  onVaciar: () => void
}

export default function CartPanel({ items, onSumar, onRestar, onQuitar, onVaciar }: Props) {
  const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)

  return (
    <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-2 font-semibold text-zinc-100">Tu carrito</h2>

      {items.length === 0 && <p className="text-sm text-zinc-500">Tu carrito está vacío.</p>}

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 text-sm text-zinc-200">
            <span className="flex-1">{item.nombre}</span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRestar(item.id)}
                aria-label={`Quitar una unidad de ${item.nombre}`}
                className="rounded-full border border-zinc-700 px-2 leading-6"
              >
                −
              </button>
              <span>{item.cantidad}</span>
              <button
                type="button"
                onClick={() => onSumar(item.id)}
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
                onClick={() => onQuitar(item.id)}
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
          <button type="button" className="text-sm text-zinc-400 underline" onClick={onVaciar}>
            Vaciar carrito
          </button>
          <p className="font-semibold text-zinc-100">Subtotal: {formatearPrecio(subtotal)}</p>
        </div>
      )}
    </section>
  )
}
