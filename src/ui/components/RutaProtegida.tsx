// RutaProtegida.tsx — Clase 7. Un "guardia" que se pone como padre de las
// rutas que necesitan sesión iniciada (acá, /checkout). Si no hay usuario,
// redirige a /login guardando de dónde venías (`state={{desde: ...}}`)
// para poder volver ahí después de loguearte. Si hay usuario, <Outlet/>
// deja pasar a la ruta real.
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useSesion from '../../aplicacion/useSesion'

export default function RutaProtegida() {
  const { usuario } = useSesion()
  const ubicacion = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  return <Outlet />
}
