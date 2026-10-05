// Devuelve null cuando no hay que mostrar nada (sin stock, o stock
// suficiente) — así ProductCard no necesita un if, la decisión vive acá.
interface Props {
  stock: number
}

export default function StockBadge({ stock }: Props) {
  if (stock === 0 || stock > 5) return null

  return <p className="text-xs font-medium text-amber-500">⚡ Últimas unidades ({stock})</p>
}