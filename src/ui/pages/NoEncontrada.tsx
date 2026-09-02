// NoEncontrada.tsx — Clase 6 (React Router): página 404 propia. Sin una
// ruta comodín, cualquier URL que no exista (o un link roto) cae en una
// pantalla en blanco en vez de explicarle al usuario qué pasó. Se registra
// en App.tsx como `path="*"`, la última ruta — React Router prueba las
// rutas en orden y usa la primera que calza.
import { Link } from 'react-router-dom'

export default function NoEncontrada() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-5xl font-bold text-zinc-700">404</p>
      <p className="text-zinc-400">Esta página no existe.</p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500"
      >
        Volver al catálogo
      </Link>
    </div>
  )
}
