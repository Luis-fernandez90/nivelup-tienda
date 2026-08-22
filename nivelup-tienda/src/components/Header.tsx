// Header.tsx — Clase 2 ("Componentes funcionales + props tipadas").
// Un componente funcional es, ni más ni menos, una función que devuelve
// JSX. Las props llegan como UN solo objeto (acá lo desestructuramos en el
// parámetro), y `interface Props` es el contrato: qué necesita este
// componente para poder pintarse.
interface Props {
  nombreTienda: string
  eslogan?: string // el "?" lo hace opcional: el componente decide un valor por defecto si falta
  resumenCarrito: string
}

export default function Header({ nombreTienda, eslogan = 'Sube de nivel tu setup', resumenCarrito }: Props) {
  return (
    <header className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-violet-400">{nombreTienda}</h1>
        <p className="text-sm text-zinc-400">{eslogan}</p>
      </div>
      <p className="text-sm font-medium text-zinc-200">{resumenCarrito}</p>
    </header>
  )
}
