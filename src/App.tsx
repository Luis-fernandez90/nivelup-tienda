// App.tsx — desde Clase 6, App ya no es "la pantalla": define las RUTAS.
// <Layout> es el molde (Header+Outlet+Footer) que envuelve a todas.
//
// Clase 7: /checkout queda adentro de <RutaProtegida> — sin sesión, te
// manda a /login. Clase 8: Login y Checkout se cargan con `lazy` (no
// todo el mundo los visita, así que no hace falta bajarlos en el bundle
// inicial); Home y el catálogo SÍ van directo, porque esos los ve todo el
// mundo apenas entra. <Suspense> muestra un fallback mientras el código
// de la página se termina de descargar.
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './ui/components/Layout'
import RutaProtegida from './ui/components/RutaProtegida'
import Home from './ui/pages/Home'
import Detalle from './ui/pages/Detalle'
import NoEncontrada from './ui/pages/NoEncontrada'

const Checkout = lazy(() => import('./ui/pages/Checkout'))
const Login = lazy(() => import('./ui/pages/Login'))

function Cargando() {
  return <p className="text-zinc-500">Cargando página…</p>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="producto/:id" element={<Detalle />} />
        <Route
          path="login"
          element={
            <Suspense fallback={<Cargando />}>
              <Login />
            </Suspense>
          }
        />
        <Route element={<RutaProtegida />}>
          <Route
            path="checkout"
            element={
              <Suspense fallback={<Cargando />}>
                <Checkout />
              </Suspense>
            }
          />
        </Route>
        {/* Comodín: SIEMPRE al final. React Router prueba las rutas en
            orden y usa la primera que calza — si esta fuera la primera,
            "ganaría" antes que cualquier otra ruta. */}
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
