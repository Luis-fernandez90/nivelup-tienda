// Checkout.tsx — Clase 6 (formulario controlado + validación). Es "un solo
// objeto controlado": los 4 campos viven en UN useState<DatosEnvio>, no en
// 4 useState separados, porque los 4 pertenecen al mismo formulario y se
// validan/envían juntos.
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useCarrito from '../../aplicacion/useCarrito'
import { guardarPedido } from '../../infraestructura/pedidos'
import formatearPrecio from '../formato'
import type { DatosEnvio } from '../../dominio/tipos'

const VACIO: DatosEnvio = { nombre: '', email: '', direccion: '', telefono: '' }

type CampoTocado = Partial<Record<keyof DatosEnvio, boolean>>
type Errores = Partial<Record<keyof DatosEnvio, string>>

// Reglas simples, una por campo. Devuelve solo los campos que están mal —
// si un campo no aparece acá, está bien.
function validar(datos: DatosEnvio): Errores {
  const errores: Errores = {}

  if (datos.nombre.trim().length < 3) errores.nombre = 'El nombre necesita al menos 3 letras.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) errores.email = 'Ese email no parece válido.'
  if (datos.direccion.trim().length < 5) errores.direccion = 'La dirección es muy corta.'
  if (!/^\d{7,}$/.test(datos.telefono.replace(/\s/g, ''))) errores.telefono = 'El teléfono necesita al menos 7 dígitos.'

  return errores
}

export default function Checkout() {
  const { items, subtotal, vaciar } = useCarrito()
  const [datos, setDatos] = useState<DatosEnvio>(VACIO)
  const [tocado, setTocado] = useState<CampoTocado>({})
  const [enviado, setEnviado] = useState(false)
  const navigate = useNavigate()

  const errores = validar(datos)

  // Un solo handler "de fábrica" para los 4 inputs: en vez de escribir
  // onChangeNombre, onChangeEmail, onChangeDireccion, onChangeTelefono
  // (4 funciones casi idénticas), esta función DEVUELVE el handler para
  // el campo que le pidas.
  function cambiar(campo: keyof DatosEnvio) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setDatos({ ...datos, [campo]: e.target.value })
    }
  }

  function marcar(campo: keyof DatosEnvio) {
    return () => setTocado({ ...tocado, [campo]: true })
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // sin esto, el navegador recarga la página y se pierde todo el estado
    setTocado({ nombre: true, email: true, direccion: true, telefono: true })

    if (Object.keys(errores).length > 0) return
    if (items.length === 0) return

    guardarPedido({
      id: Date.now(),
      fecha: new Date().toISOString(),
      cliente: datos,
      items,
      total: subtotal,
    })
    vaciar()
    setEnviado(true)
  }

  if (enviado) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <h2 className="mb-2 text-xl font-bold text-violet-400">¡Gracias por tu compra!</h2>
        <p className="text-zinc-400">Tu pedido quedó registrado. Ya podés volver al catálogo.</p>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <p className="text-zinc-400">Tu carrito está vacío — agregá algo antes de pagar.</p>
        <button type="button" className="mt-3 text-violet-400 underline" onClick={() => navigate('/')}>
          Ir al catálogo
        </button>
      </section>
    )
  }

  const campos: { clave: keyof DatosEnvio; etiqueta: string; tipo: string }[] = [
    { clave: 'nombre', etiqueta: 'Nombre completo', tipo: 'text' },
    { clave: 'email', etiqueta: 'Email', tipo: 'email' },
    { clave: 'direccion', etiqueta: 'Dirección de envío', tipo: 'text' },
    { clave: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
  ]

  return (
    <form onSubmit={enviar} className="mx-auto max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-4 text-lg font-semibold text-zinc-100">Datos de envío</h2>

      {campos.map(({ clave, etiqueta, tipo }) => (
        <div key={clave} className="mb-4">
          <label htmlFor={clave} className="mb-1 block text-sm text-zinc-300">
            {etiqueta}
          </label>
          <input
            id={clave}
            type={tipo}
            // `value` + `onChange` juntos: sin onChange el input queda
            // "congelado" (React no deja que el usuario escriba porque el
            // valor siempre lo controla el estado).
            value={datos[clave]}
            onChange={cambiar(clave)}
            onBlur={marcar(clave)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
          {tocado[clave] && errores[clave] && <span className="mt-1 block text-xs text-red-400">{errores[clave]}</span>}
        </div>
      ))}

      <p className="mb-4 text-sm text-zinc-400">Total a pagar: {formatearPrecio(subtotal)}</p>

      <button
        type="submit"
        className="w-full rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
      >
        Confirmar pedido
      </button>
    </form>
  )
}
