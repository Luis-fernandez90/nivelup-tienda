// ProductCard.tsx — Clase 2 (componente + props tipadas), Clase 3
// (renderizado condicional) y Clase 6 (ya no recibe `onAgregar` por props:
// llama directo a useCarrito().agregar). Clase 8: envuelto en `memo` — como
// el catálogo puede tener muchas tarjetas, `memo` evita re-renderizar las
// que no cambiaron cuando algo más en la pantalla se actualiza.
import { memo } from 'react'
import { Link } from 'react-router-dom'
import formatearPrecio from '../formato'
import type { Producto } from '../../dominio/tipos'
import useCarrito from '../../aplicacion/useCarrito'
import StockBadge from './StockBadge'

interface Props {
  producto: Producto
}

function ProductCard({ producto }: Props) {
  const { agregar } = useCarrito()
  const agotado = producto.stock === 0

  return (
    <article
      className={`w-64 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition ${
        agotado ? 'opacity-50' : 'hover:border-violet-500'
      }`}
    >
      {/* Clase 6: cada tarjeta enlaza a su propia URL (/producto/:id) —
          la página de detalle, no solo un estado en memoria. */}
      <Link to={`/producto/${producto.id}`}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="mb-3 aspect-square w-full rounded-lg object-cover"
        />
        <p className="text-xs uppercase tracking-wide text-zinc-500">{producto.marca}</p>
        <h2 className="font-semibold text-zinc-100 hover:text-violet-400">{producto.nombre}</h2>
      </Link>
      <StockBadge stock={producto.stock} />
      <p className="mt-2 text-lg font-bold text-violet-400">{formatearPrecio(producto.precio)}</p>
      <button
        type="button"
        className="mt-3 w-full rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-violet-600 hover:border-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        onClick={() => agregar(producto)}
        disabled={agotado}
      >
        {agotado ? 'Agotado' : 'Agregar al carrito'}
      </button>
    </article>
  )
}

// OJO: `memo` compara props superficialmente (acá, si `producto` sigue
// siendo el MISMO objeto). No evita que se vuelva a renderizar por cambios
// de Context (useCarrito) — eso es aparte, y es intencional: si cambia el
// carrito, cada tarjeta necesita poder reaccionar (por ejemplo, si en el
// futuro mostramos "ya está en tu carrito").
export default memo(ProductCard)
