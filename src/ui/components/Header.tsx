// Header con el logo, la navegación, el resumen del carrito y la sesión
// (muestra "Hola, {nombre}" + Salir, o el link para iniciar sesión).
import { Link, NavLink } from 'react-router-dom'
import useCarrito from '../../aplicacion/useCarrito'
import useSesion from '../../aplicacion/useSesion'
import formatearPrecio from '../formato'

interface Props {
  nombreTienda: string
  eslogan?: string
}

const enlace = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${
    isActive ? 'font-semibold text-violet-400 underline' : 'text-zinc-400 hover:text-zinc-200'
  }`

export default function Header({ nombreTienda, eslogan = 'Sube de nivel tu setup' }: Props) {
  const { unidades, subtotal } = useCarrito()
  const { usuario, salir } = useSesion()
  const resumenCarrito = unidades > 0 ? `🎮 ${unidades} · ${formatearPrecio(subtotal)}` : '🎮 carrito vacío'

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
      <div>
        <Link to="/" className="group inline-flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-9 w-9 text-violet-400 transition-transform duration-300 group-hover:scale-125"
          >
            <rect x="2" y="7" width="20" height="10" rx="5" />
            <line x1="7" y1="10" x2="7" y2="14" />
            <line x1="5" y1="12" x2="9" y2="12" />
            <circle cx="15" cy="10.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="17.5" cy="13" r="1" fill="currentColor" stroke="none" />
          </svg>
          <h1 className="texto-bandera text-4xl font-extrabold tracking-tight transition-transform duration-300 group-hover:scale-105">
            {nombreTienda}
          </h1>
        </Link>
        <p className="text-sm text-zinc-400">{eslogan}</p>
      </div>
      <nav className="flex items-center gap-4">
        <NavLink to="/" end className={enlace}>
          Catálogo
        </NavLink>
        <NavLink to="/checkout" className={enlace}>
          Checkout
        </NavLink>
        <p className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-zinc-200">
          {resumenCarrito}
        </p>
        {usuario ? (
          <span className="flex items-center gap-2 text-sm text-zinc-300">
            Hola, {usuario.nombre}
            <button
              type="button"
              onClick={salir}
              className="text-violet-400 underline transition-colors hover:text-violet-300"
            >
              Salir
            </button>
          </span>
        ) : (
          <NavLink to="/login" className={enlace}>
            Inicia sesión
          </NavLink>
        )}
      </nav>
    </header>
  )
}