// Header.tsx — Clase 2 (componente + props tipadas), lee el carrito
// directo del Context desde Clase 6 (evita prop drilling) y usa <NavLink>
// para marcar en qué página estás. Clase 7: también lee la sesión con
// useSesion() para mostrar "Hola, {nombre}" + Salir, o "Inicia sesión".
import { NavLink } from 'react-router-dom'
import useCarrito from '../../aplicacion/useCarrito'
import useSesion from '../../aplicacion/useSesion'
import formatearPrecio from '../formato'

interface Props {
  nombreTienda: string
  eslogan?: string
}

const enlace = ({ isActive }: { isActive: boolean }) =>
  `text-sm ${isActive ? 'font-semibold text-violet-400 underline' : 'text-zinc-400 hover:text-zinc-200'}`

export default function Header({ nombreTienda, eslogan = 'Sube de nivel tu setup' }: Props) {
  const { unidades, subtotal } = useCarrito()
  const { usuario, salir } = useSesion()
  const resumenCarrito = unidades > 0 ? `🎮 ${unidades} · ${formatearPrecio(subtotal)}` : '🎮 carrito vacío'

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-violet-400">{nombreTienda}</h1>
        <p className="text-sm text-zinc-400">{eslogan}</p>
      </div>
      <nav className="flex items-center gap-4">
        <NavLink to="/" end className={enlace}>
          Catálogo
        </NavLink>
        <NavLink to="/checkout" className={enlace}>
          Checkout
        </NavLink>
        <p className="text-sm font-medium text-zinc-200">{resumenCarrito}</p>
        {usuario ? (
          <span className="flex items-center gap-2 text-sm text-zinc-300">
            Hola, {usuario.nombre}
            <button type="button" onClick={salir} className="text-violet-400 underline">
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
