// ProductCard.tsx — Clase 2 (componente + props tipadas) y Clase 3
// (renderizado condicional: el estado "agotado" cambia clases y el botón).
import formatearPrecio from '../formato'
import type { Producto } from '../tipos'
import StockBadge from './StockBadge'

interface Props {
  producto: Producto
  // Una prop puede ser una FUNCIÓN: así es como un hijo le avisa algo al
  // padre (acá, "agregame al carrito"), sin que el hijo sepa nada de cómo
  // funciona el carrito — eso lo decide quien use <ProductCard>.
  onAgregar: (producto: Producto) => void
}

export default function ProductCard({ producto, onAgregar }: Props) {
  const agotado = producto.stock === 0

  return (
    <article
      className={`w-64 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition ${
        agotado ? 'opacity-50' : 'hover:border-violet-500'
      }`}
    >
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="mb-3 aspect-square w-full rounded-lg object-cover"
      />
      <p className="text-xs uppercase tracking-wide text-zinc-500">{producto.marca}</p>
      <h2 className="font-semibold text-zinc-100">{producto.nombre}</h2>
      <StockBadge stock={producto.stock} />
      <p className="mt-2 text-lg font-bold text-violet-400">{formatearPrecio(producto.precio)}</p>
      <button
        type="button"
        className="mt-3 w-full rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-violet-600 hover:border-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        onClick={() => onAgregar(producto)}
        disabled={agotado}
      >
        {agotado ? 'Agotado' : 'Agregar al carrito'}
      </button>
    </article>
  )
}
