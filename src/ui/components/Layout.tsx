// Layout: envuelve todas las páginas con el Header y el Footer, para no
// repetirlas en cada una. Lo que va dentro de <Outlet/> cambia según la URL.
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-violet-950/30 text-zinc-100">
      {/* Mandos de videojuego dibujados solo con el borde, como decoración de fondo */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-16 h-96 w-96 rotate-12 text-violet-500/10"
      >
        <rect x="2" y="7" width="20" height="10" rx="5" />
        <line x1="7" y1="10" x2="7" y2="14" />
        <line x1="5" y1="12" x2="9" y2="12" />
        <circle cx="15" cy="10.5" r="1" />
        <circle cx="17.5" cy="13" r="1" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 -rotate-12 text-violet-500/10"
      >
        <rect x="2" y="7" width="20" height="10" rx="5" />
        <line x1="7" y1="10" x2="7" y2="14" />
        <line x1="5" y1="12" x2="9" y2="12" />
        <circle cx="15" cy="10.5" r="1" />
        <circle cx="17.5" cy="13" r="1" />
      </svg>

      <main className="relative mx-auto max-w-5xl px-6 py-8">
        <Header nombreTienda="NivelUp" />
        <Outlet />
        <Footer />
      </main>
    </div>
  )
}