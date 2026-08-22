// App.tsx — el componente raíz. Junta los datos, el estado y los eventos;
// los componentes de abajo (Header, ProductCard, CartPanel...) solo pintan
// lo que reciben por props.
//
// Dónde va cada cosa, clase por clase:
//   Clase 1 → el catálogo semilla (datos.ts) y el primer JSX.
//   Clase 2 → separar todo en componentes con props tipadas.
//   Clase 3 → renderizado condicional (StockBadge, el estado vacío) y de
//             listas (el .map() del catálogo, con su `key`).
//   Clase 4 → useState para el carrito: agregar, sumar, restar, quitar,
//             vaciar, y abrir/cerrar el panel.
//   Clase 5 → ESTADO DERIVADO: categoriaActiva y termino son los únicos
//             datos guardados; la lista "visible" y las categorías se
//             CALCULAN en cada render, no se guardan aparte.
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ProductCard from './components/ProductCard'
import CartPanel from './components/CartPanel'
import { productos } from './datos'
import type { ItemCarrito, Producto } from './tipos'
import { agregarItem, cambiarCantidad, quitarItem, resumenCarrito } from './carrito'
import formatearPrecio from './formato'

export default function App() {
  // ---------- Estado ----------
  // Todavía no hay localStorage (eso es Clase 6): el carrito vive solo
  // mientras la pestaña está abierta, y se reinicia si recargás la página.
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [termino, setTermino] = useState('')

  // ---------- Eventos: cambian el estado, nunca la pantalla directo ----------
  function agregarAlCarrito(producto: Producto) {
    setCarrito(agregarItem(carrito, producto))
  }
  function sumarUno(id: number) {
    setCarrito(cambiarCantidad(carrito, id, 1))
  }
  function restarUno(id: number) {
    setCarrito(cambiarCantidad(carrito, id, -1))
  }
  function quitarDelCarrito(id: number) {
    setCarrito(quitarItem(carrito, id))
  }
  function vaciarCarrito() {
    setCarrito([])
  }

  // ---------- Estado derivado (Clase 5) ----------
  // Ninguna de estas tres constantes es un dato guardado: las tres se
  // recalculan en CADA render a partir de `productos`, `categoriaActiva` y
  // `termino`. Si se guardaran aparte (por ejemplo en su propio useState),
  // podrían quedar desincronizadas del catálogo real — acá es imposible,
  // porque siempre se recalculan desde la fuente.
  const categorias = ['todas', ...new Set(productos.map((p) => p.categoria))]

  const busqueda = termino.trim().toLowerCase()
  const visibles = productos.filter((p) => {
    const pasaCategoria = categoriaActiva === 'todas' || p.categoria === categoriaActiva
    const pasaBusqueda =
      busqueda === '' || p.nombre.toLowerCase().includes(busqueda) || p.marca.toLowerCase().includes(busqueda)
    return pasaCategoria && pasaBusqueda
  })

  const { unidades, subtotal } = resumenCarrito(carrito)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Header
          nombreTienda="NivelUp"
          resumenCarrito={unidades > 0 ? `🎮 ${unidades} · ${formatearPrecio(subtotal)}` : '🎮 carrito vacío'}
        />

        <button
          type="button"
          className="mb-4 text-sm text-violet-400 underline"
          onClick={() => setCarritoAbierto(!carritoAbierto)}
        >
          {carritoAbierto ? 'Ocultar carrito' : 'Ver carrito'}
        </button>

        {carritoAbierto && (
          <CartPanel
            items={carrito}
            onSumar={sumarUno}
            onRestar={restarUno}
            onQuitar={quitarDelCarrito}
            onVaciar={vaciarCarrito}
          />
        )}

        {/* Renderizado de listas (Clase 3): cada botón necesita su `key`,
            React la usa para saber qué elemento es cuál entre un render y
            el siguiente, sin volver a crear el DOM de los que no cambiaron. */}
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

        {/* Renderizado condicional (Clase 3): el estado vacío del catálogo,
            distinto según si el usuario estaba buscando algo o no. */}
        {visibles.length === 0 ? (
          <p className="text-zinc-500">
            {busqueda !== ''
              ? `No encontramos nada para "${termino.trim()}".`
              : 'No hay productos en esta categoría.'}
          </p>
        ) : (
          <section className="flex flex-wrap gap-4">
            {visibles.map((producto) => (
              <ProductCard key={producto.id} producto={producto} onAgregar={agregarAlCarrito} />
            ))}
          </section>
        )}

        <Footer />
      </main>
    </div>
  )
}
