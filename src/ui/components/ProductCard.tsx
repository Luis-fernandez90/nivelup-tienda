// Tarjeta de producto. Usa memo porque el catálogo tiene varias tarjetas
// y no todas necesitan re-renderizarse cuando cambia algo en pantalla.
import { memo, useState } from 'react'
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
  const [agregado, setAgregado] = useState(false)

  function manejarAgregar() {
    agregar(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <article
      className={`relative w-64 animate-fade-in-up rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition duration-300 ${
        agotado
          ? 'opacity-50'
          : 'hover:-translate-y-1 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/20'
      }`}
    >
      {agregado && (
        <span className="animate-fade-in-up absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-medium text-white shadow-lg">
          ✓ Agregado
        </span>
      )}

      {/* Enlaza a la página de detalle del producto */}
      <Link to={`/producto/${producto.id}`}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="mb-3 aspect-square w-full rounded-lg object-cover"
        />
        <p className="text-xs uppercase tracking-wide text-zinc-500">{producto.marca}</p>
        <h2 className="font-semibold text-zinc-100 transition-colors hover:text-violet-400">
          {producto.nombre}
        </h2>
      </Link>
      <StockBadge stock={producto.stock} />
      <p className="mt-2 text-lg font-bold text-violet-400">{formatearPrecio(producto.precio)}</p>
      <button
        type="button"
        className="mt-3 w-full rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-violet-600 hover:border-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        onClick={manejarAgregar}
        disabled={agotado}
      >
        {agotado ? 'Agotado' : 'Agregar al carrito'}
      </button>
    </article>
  )
}

// memo compara las props (si `producto` es el mismo objeto). No evita que
// se re-renderice por cambios del carrito, y eso es intencional.
export default memo(ProductCard)