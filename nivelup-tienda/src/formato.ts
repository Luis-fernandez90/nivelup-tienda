// formato.ts — cómo se muestran los números. Igual que en el proyecto de
// fundamentos: una sola función, un solo lugar, para no repetir
// `.toFixed(2)` en cada componente que muestra un precio.
export default function formatearPrecio(precio: number): string {
  return `S/ ${precio.toFixed(2)}`
}
