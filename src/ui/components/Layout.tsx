// Layout.tsx — Clase 6 (React Router). Un layout es un "molde": no está
// registrado como una ruta en sí (no tiene su propio path), envuelve a
// varias. Todo lo que va DENTRO de <Outlet/> es la pantalla que React
// Router decidió mostrar según la URL — acá siempre aparecen Header y
// Footer alrededor, sin repetirlos en cada página.
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Header nombreTienda="NivelUp" />
        <Outlet />
        <Footer />
      </main>
    </div>
  )
}
