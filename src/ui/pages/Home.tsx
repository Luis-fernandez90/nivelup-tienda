// Home.tsx — Clase 6 (React Router): el catálogo, los filtros, el
// buscador y el panel del carrito. App ya no es "la pantalla", es el que
// arma las RUTAS; cada ruta es una pantalla distinta (Home, Checkout,
// Login...), y todas comparten Header/Footer a través de <Layout>.
//
// Clase 8: `visibles` se envuelve en `useMemo`. Antes se recalculaba en
// CADA render (incluidos los que no tienen nada que ver con el filtro,
// como abrir/cerrar el carrito) — con useMemo solo se vuelve a calcular
// si `productos`, `categoriaActiva` o `termino` cambiaron de verdad.
import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import CartPanel from '../components/CartPanel'
import { productos } from '../../infraestructura/datos'

export default function Home() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [termino, setTermino] = useState('')

  // Estas categorías son baratas de calcular (recorren 8 productos), así
  // que se quedan como estaban — sin useMemo no vale la pena.
  const categorias = ['todas', ...new Set(productos.map((p) => p.categoria))]

  const busqueda = termino.trim().toLowerCase()
  const visibles = useMemo(() => {
    return productos.filter((p) => {
      const pasaCategoria = categoriaActiva === 'todas' || p.categoria === categoriaActiva
      const pasaBusqueda =
        busqueda === '' || p.nombre.toLowerCase().includes(busqueda) || p.marca.toLowerCase().includes(busqueda)
      return pasaCategoria && pasaBusqueda
    })
  }, [categoriaActiva, busqueda])

  return (
    <>
      <button
        type="button"
        className="mb-4 text-sm text-violet-400 underline"
        onClick={() => setCarritoAbierto(!carritoAbierto)}
      >
        {carritoAbierto ? 'Ocultar carrito' : 'Ver carrito'}
      </button>

      {/* CartPanel ya no recibe props (Clase 6): lee el carrito directo del Context. */}
      {carritoAbierto && <CartPanel />}

      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filtrar por categoría">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            onClick={() => setCategoriaActiva(categoria)}
            className={`rounded-full border px-3 py-1 text-sm capitalize transition ${
              categoria === categoriaActiva
                ? 'border-violet-500 bg-violet-600 text-white'
                : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            {categoria}
          </button>
        ))}
      </nav>

      <input
        type="search"
        placeholder="Buscar por nombre o marca…"
        value={termino}
        onChange={(evento) => setTermino(evento.target.value)}
        className="mb-6 w-72 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
        aria-label="Buscar productos"
      />

      {visibles.length === 0 ? (
        <p className="text-zinc-500">
          {busqueda !== ''
            ? `No encontramos nada para "${termino.trim()}".`
            : 'No hay productos en esta categoría.'}
        </p>
      ) : (
        <section className="flex flex-wrap gap-4">
          {visibles.map((producto) => (
            // ProductCard ya no recibe onAgregar (Clase 6): usa useCarrito() directo.
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </section>
      )}
    </>
  )
}
