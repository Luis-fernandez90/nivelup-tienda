// Detalle.tsx — Clase 6 (React Router): un producto, por su propia URL
// (/producto/:id) — no solo un modal o un estado en memoria. Se puede
// compartir el link, recargar la página en ella (vercel.json se encarga de
// que eso no dé 404), y usa exactamente el mismo mecanismo de carga que
// Home: cargando / listo / error, con reintentar.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import formatearPrecio from '../formato'
import { obtenerProductoPorId } from '../../infraestructura/datos'
import useCarrito from '../../aplicacion/useCarrito'
import type { EstadoCarga, Producto } from '../../dominio/tipos'
import StockBadge from '../components/StockBadge'

export default function Detalle() {
  // useParams lee el segmento dinámico de la URL que declaramos en
  // App.tsx (`path="producto/:id"`). Siempre llega como string, aunque en
  // la URL se vea como un número — por eso el Number(id) más abajo.
  const { id } = useParams()
  const { agregar } = useCarrito()

  const [producto, setProducto] = useState<Producto | null>(null)
  const [estado, setEstado] = useState<EstadoCarga>('cargando')
  const [intentos, setIntentos] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()
    setEstado('cargando')

    obtenerProductoPorId(Number(id), controlador.signal)
      .then((encontrado) => {
        if (!encontrado) {
          // No es un error de red — el pedido funcionó, simplemente ese id
          // no existe en el catálogo (por ejemplo, alguien escribió la URL
          // a mano). Lo tratamos como "error" para reusar la misma
          // pantalla, pero el mensaje de abajo es distinto.
          setEstado('error')
          return
        }
        setProducto(encontrado)
        setEstado('listo')
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setEstado('error')
      })

    return () => controlador.abort()
    // `id` entra a las dependencias a propósito: si navegás de un producto
    // a otro (¡sin recargar la página!), React Router cambia el id pero el
    // componente Detalle sigue siendo el mismo — sin esto, seguiría
    // mostrando el producto anterior.
  }, [id, intentos])

  if (estado === 'cargando') {
    return <p className="text-zinc-500">Cargando producto…</p>
  }

  if (estado === 'error' || !producto) {
    return (
      <div className="max-w-md rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
        <p>No pudimos mostrar este producto. Puede que no exista o haya un problema de conexión.</p>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => setIntentos((i) => i + 1)}
            className="rounded-full border border-red-700 px-4 py-1.5 font-medium text-red-100 hover:bg-red-900"
          >
            Reintentar
          </button>
          <Link
            to="/"
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-zinc-200 hover:border-zinc-500"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const agotado = producto.stock === 0

  return (
    <article className="max-w-xl">
      <Link to="/" className="mb-4 inline-block text-sm text-violet-400 underline">
        ← Volver al catálogo
      </Link>
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="mb-4 aspect-square w-full max-w-sm rounded-xl object-cover"
      />
      <p className="text-xs uppercase tracking-wide text-zinc-500">{producto.marca}</p>
      <h1 className="text-2xl font-bold text-zinc-100">{producto.nombre}</h1>
      <StockBadge stock={producto.stock} />
      <p className="mt-2 text-2xl font-bold text-violet-400">{formatearPrecio(producto.precio)}</p>
      <button
        type="button"
        onClick={() => agregar(producto)}
        disabled={agotado}
        className="mt-4 rounded-full border border-zinc-700 px-6 py-2 font-medium text-zinc-100 transition hover:bg-violet-600 hover:border-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        {agotado ? 'Agotado' : 'Agregar al carrito'}
      </button>
    </article>
  )
}
