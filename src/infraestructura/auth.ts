// auth.ts — Clase 7 (JWT). Habla con la API real de DummyJSON
// (https://dummyjson.com/docs/auth) para login y para validar el token.
//
// Patrón "adaptador": la API devuelve una forma (`RespuestaLogin`, con
// nombres en inglés y campos que a nosotros no nos interesan). Esa
// interfaz NO se exporta — nadie fuera de este archivo debería enterarse
// de cómo habla la API. Lo único que sale de acá es `Usuario`, la forma
// que el resto de la app espera (dominio/tipos.ts). Si mañana cambiamos
// de API, solo se toca este archivo.
import type { Usuario } from '../dominio/tipos'

// El `|| '...'` es un respaldo: si por algún motivo no existe un archivo
// .env (por ejemplo, recién clonaste el repo y todavía no lo creaste),
// la app igual funciona con este valor. Lo ideal siempre es tener tu
// propio .env (mirá .env.example) — pero que falte no debería romper la app.
const base = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

// Minutos que dura el token — se lo mandamos nosotros a la API, y con eso
// calculamos `expiraEn` (Date.now() + esto en milisegundos).
const MINUTOS_SESION = 30

interface RespuestaLogin {
  id: number
  username: string
  email: string
  firstName?: string
  accessToken: string
}

// JWT: un token tiene 3 partes separadas por puntos (header.payload.signature).
// Está FIRMADO, no encriptado — cualquiera puede leer el payload — así que
// nunca debería llevar datos secretos. Acá no lo decodificamos: confiamos
// en la API para validarlo (obtenerPerfil, abajo).
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

// Primer fetch AUTENTICADO del curso: el token va en el header
// `Authorization: Bearer ...`, nunca en la URL (las URLs quedan logueadas
// en varios lugares — servidores, historial del navegador, etc.).
export async function obtenerPerfil(token: string, signal?: AbortSignal): Promise<void> {
  const respuesta = await fetch(`${base}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })

  if (!respuesta.ok) {
    throw new Error('Sesión inválida o vencida.')
  }
}
