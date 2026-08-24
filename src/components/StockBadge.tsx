// StockBadge.tsx — Clase 3 ("Renderizado condicional"). Un componente
// puede devolver `null`: React simplemente no pinta nada ahí. Es la forma
// más simple de "a veces se muestra, a veces no" — no hace falta un `if`
// en el componente que lo usa (ProductCard), la decisión vive acá adentro.
interface Props {
  stock: number
}

export default function StockBadge({ stock }: Props) {
  if (stock === 0 || stock > 5) return null

  return <p className="text-xs font-medium text-amber-500">⚡ Últimas unidades ({stock})</p>
}
