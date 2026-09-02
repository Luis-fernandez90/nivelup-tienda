// Home.tsx — Clase 6 (React Router): el catálogo, los filtros, el
// buscador y el panel del carrito. App ya no es "la pantalla", es el que
// arma las RUTAS; cada ruta es una pantalla distinta (Home, Detalle,
// Checkout, Login...), y todas comparten Header/Footer a través de
// <Layout>.
//
// Clase 6 (API + estados de carga): el catálogo ya no se importa como un
// array fijo — se PIDE con obtenerProductos(), que devuelve una Promise.
// Eso significa que hay un momento en que todavía no llegó (cargando), uno
// en que llegó bien (listo) y uno en que algo salió mal (error). Los tres
// estados se muestran, nunca se ignoran.
//
// Clase 8: `visibles` se envuelve en `useMemo`. Antes se recalculaba en
// CADA render (incluidos los que no tienen nada que ver con el filtro,
// como abrir/cerrar el carrito) — con useMemo solo se vuelve a calcular
// si `productos`, `categoriaActiva` o `termino` cambiaron de verdad.
import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import CartPanel from '../components/CartPanel'
import { obtenerProductos } from '../../infraestructura/datos'
import type { EstadoCarga, Producto } from '../../dominio/tipos'

export default function Home() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [termino, setTermino] = useState('')

  const [productos, setProductos] = useState<Producto[]>([])
  const [estado, setEstado] = useState<EstadoCarga>('cargando')
  // No representa nada del pedido en sí — es un truco para el botón
  // "Reintentar": cambiarlo no hace nada por sí solo, pero como está en
  // las dependencias del useEffect, cambiarlo hace que el efecto vuelva a
  // correr y pida el catálogo de nuevo.
  const [intentos, setIntentos] = useState(0)

  // Pedir productos es "mundo de afuera" (red), igual que el localStorage
  // de Clase 6: nunca va directo en el render, va en un useEffect.
  useEffect(() => {
    const controlador = new AbortController()
    setEstado('cargando')

    obtenerProductos(controlador.signal)
      .then((datos) => {
        setProductos(datos)
        setEstado('listo')
      })
      .catch((error) => {
        // AbortError no es un error real del pedido — es que NOSOTROS lo
        // cancelamos (ver el cleanup, abajo). Si lo tratáramos como error,
        // el usuario vería "algo salió mal" cada vez que este efecto se
        // reinicia sin que haya pasado nada malo.
        if (error instanceof DOMException && error.name === 'AbortError') return
        setEstado('error')
      })

    // Limpieza: si el componente se desmonta, o el efecto vuelve a correr
    // (por ejemplo, apretaste "Reintentar" dos veces seguido) antes de que
    // el pedido anterior responda, lo cancelamos. Sin esto, un pedido
    // viejo podría "ganarle" al nuevo y pisar datos más frescos.
    return () => controlador.abort()
  }, [intentos])

  const categorias = useMemo(() => ['todas', ...new Set(productos.map((p) => p.categoria))], [productos])

  const busqueda = termino.trim().toLowerCase()
  const visibles = useMemo(() => {
    return productos.filter((p) => {
      const pasaCategoria = categoriaActiva === 'todas' || p.categoria === categoriaActiva
      const pasaBusqueda =
        busqueda === '' || p.nombre.toLowerCase().includes(busqueda) || p.marca.toLowerCase().includes(busqueda)
      return pasaCategoria && pasaBusqueda
    })
  }, [productos, categoriaActiva, busqueda])

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
