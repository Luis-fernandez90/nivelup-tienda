// Home.tsx — catálogo con filtros, buscador y panel de carrito. Los
// productos se piden con obtenerProductos() (Promise), así que hay estados
// de carga, listo y error. `visibles` usa useMemo para no recalcular el
// filtro en cada render.
import { useEffect, useMemo, useReducer, useState } from 'react'
import ProductCard from '../components/ProductCard'
import CartPanel from '../components/CartPanel'
import { obtenerProductos } from '../../infraestructura/datos'
import type { EstadoCarga, Producto } from '../../dominio/tipos'
interface EstadoFiltro {
  categoriaActiva: string
  termino: string
  carritoAbierto: boolean
}

type AccionFiltro =
  | { tipo: 'categoria'; valor: string }
  | { tipo: 'buscar'; valor: string }
  | { tipo: 'alternarCarrito' }

function filtroReducer(estado: EstadoFiltro, accion: AccionFiltro): EstadoFiltro {
  switch (accion.tipo) {
    case 'categoria':
      return { ...estado, categoriaActiva: accion.valor }
    case 'buscar':
      return { ...estado, termino: accion.valor }
    case 'alternarCarrito':
      return { ...estado, carritoAbierto: !estado.carritoAbierto }
  }
}
export default function Home() {
const [filtro, dispatch] = useReducer(filtroReducer, { categoriaActiva: 'todas', termino: '', carritoAbierto: false })

  const [productos, setProductos] = useState<Producto[]>([])
  const [estado, setEstado] = useState<EstadoCarga>('cargando')
  // Cambiar este número fuerza a que el useEffect vuelva a pedir el catálogo.
  const [intentos, setIntentos] = useState(0)

  // Pedir productos va en un useEffect, no directo en el render.
  useEffect(() => {
    const controlador = new AbortController()
    setEstado('cargando')

    obtenerProductos(controlador.signal)
      .then((datos) => {
        setProductos(datos)
        setEstado('listo')
      })
      .catch((error) => {
        // Si cancelamos nosotros el pedido (AbortError), no lo tratamos como error.
        if (error instanceof DOMException && error.name === 'AbortError') return
        setEstado('error')
      })

    // Cancela el pedido si el componente se desmonta o se pide de nuevo.
    return () => controlador.abort()
  }, [intentos])

  const categorias = useMemo(() => ['todas', ...new Set(productos.map((p) => p.categoria))], [productos])

  const busqueda = filtro.termino.trim().toLowerCase()
  const visibles = useMemo(() => {
    return productos.filter((p) => {
      const pasaCategoria = filtro.categoriaActiva === 'todas' || p.categoria === filtro.categoriaActiva
      const pasaBusqueda =
        busqueda === '' || p.nombre.toLowerCase().includes(busqueda) || p.marca.toLowerCase().includes(busqueda)
      return pasaCategoria && pasaBusqueda
    })
  }, [productos, filtro.categoriaActiva, busqueda])

  if (estado === 'cargando') {
    return <p className="text-zinc-500">Cargando catálogo…</p>
  }

  if (estado === 'error') {
    return (
      <div className="max-w-md rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
        <p>No pudimos cargar el catálogo. Puede ser un problema de conexión.</p>
        <button
          type="button"
          onClick={() => setIntentos((i) => i + 1)}
          className="mt-3 rounded-full border border-red-700 px-4 py-1.5 font-medium text-red-100 hover:bg-red-900"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className="mb-4 text-sm text-violet-400 underline"
        onClick={() => dispatch({ tipo: 'alternarCarrito' })}
      >
        {filtro.carritoAbierto ? 'Ocultar carrito' : 'Ver carrito'}
      </button>

      {/* CartPanel lee el carrito directo del Context. */}
      {filtro.carritoAbierto && <CartPanel />}

      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filtrar por categoría">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            onClick={() => dispatch({ tipo: 'categoria', valor: categoria })}
            className={`rounded-full border px-3 py-1 text-sm capitalize transition ${
              categoria === filtro.categoriaActiva
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
        value={filtro.termino}
        onChange={(evento) => dispatch({ tipo: 'buscar', valor: evento.target.value })}
        className="mb-6 w-72 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
        aria-label="Buscar productos"
      />

      {visibles.length === 0 ? (
        <p className="text-zinc-500">
          {busqueda !== ''
            ? `No encontramos nada para "${filtro.termino.trim()}".`
            : 'No hay productos en esta categoría.'}
        </p>
      ) : (
        <section className="flex flex-wrap gap-4">
          {visibles.map((producto) => (
            // ProductCard usa useCarrito() directo, no recibe onAgregar por props.
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </section>
      )}
    </>
  )
}
