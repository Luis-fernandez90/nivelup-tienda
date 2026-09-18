// Login contra la API de DummyJSON. Convertimos su respuesta a nuestro
// tipo Usuario, para que el resto de la app no dependa de cómo responde la API.
import type { Usuario } from '../dominio/tipos'

// Si no hay .env configurado, usa esta URL por defecto.
const base = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

// Minutos que dura la sesión antes de expirar.
const MINUTOS_SESION = 30

interface RespuestaLogin {
  id: number
  username: string
  email: string
  firstName?: string
  accessToken: string
}

// No decodificamos el token acá, la API lo valida en obtenerPerfil.
export async function iniciarSesion(usuario: string, clave: string): Promise<Usuario> {
  const respuesta = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usuario, password: clave, expiresInMins: MINUTOS_SESION }),
  })

  if (!respuesta.ok) {
    throw new Error('Usuario o contraseña incorrectos.')
  }

  const datos: RespuestaLogin = await respuesta.json()

  return {
    id: datos.id,
    nombre: datos.firstName ?? datos.username,
    email: datos.email,
    token: datos.accessToken,
    expiraEn: Date.now() + MINUTOS_SESION * 60 * 1000,
  }
}

// El token va en el header Authorization, no en la URL.
export async function obtenerPerfil(token: string, signal?: AbortSignal): Promise<void> {
  const respuesta = await fetch(`${base}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })

  if (!respuesta.ok) {
    throw new Error('Sesión inválida o vencida.')
  }
}
