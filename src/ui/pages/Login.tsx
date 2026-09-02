// Login.tsx — Clase 7. Acá SÍ van dos useState separados (no un objeto
// como en Checkout): son solo dos campos sueltos, no un formulario grande
// con muchos campos relacionados.
//
// `enviando` bloquea el botón mientras la petición está en curso, para
// que un click doble no dispare dos logins al mismo tiempo. La sesión
// NUNCA guarda la contraseña en el estado más de lo necesario para
// mandarla — no se persiste en ningún lado, ni siquiera acá.
import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useSesion from '../../aplicacion/useSesion'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const { entrar } = useSesion()
  const navigate = useNavigate()
  const ubicacion = useLocation()

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await entrar(usuario, clave)
      // Si RutaProtegida te mandó acá desde /checkout, `location.state.desde`
      // tiene esa ruta guardada — volvemos justo ahí en vez de siempre al catálogo.
      const desde = (ubicacion.state as { desde?: string } | null)?.desde ?? '/'
      navigate(desde, { replace: true })
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-1 text-lg font-semibold text-zinc-100">Iniciar sesión</h2>
      <p className="mb-4 text-xs text-zinc-500">
        Demo con DummyJSON — usuario <code className="text-violet-400">emilys</code>, contraseña{' '}
        <code className="text-violet-400">emilyspass</code>.
      </p>

      <div className="mb-4">
        <label htmlFor="usuario" className="mb-1 block text-sm text-zinc-300">
          Usuario
        </label>
        <input
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="clave" className="mb-1 block text-sm text-zinc-300">
          Contraseña
        </label>
        <input
          id="clave"
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
