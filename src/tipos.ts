// tipos.ts — el contrato de la tienda. La misma idea que en el proyecto de
// TypeScript de fundamentos: la forma de un Producto se define UNA vez acá,
// y todo lo demás (el catálogo, las tarjetas, el carrito) la importa en vez
// de repetirla.
export interface Producto {
  id: number
  nombre: string
  marca: string
  precio: number
  imagen: string
  stock: number
  categoria: string
}

// Un ítem del carrito no es un Producto completo: solo necesita lo que se
// muestra y se calcula ahí (nombre, precio, cuántas unidades). Guardar el
// producto entero sería arrastrar datos que el carrito nunca usa.
export interface ItemCarrito {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

// Las categorías del catálogo, como unión de literales: "todas" siempre
// existe (es el filtro por defecto) más las categorías reales de datos.ts.
export type CategoriaId = 'todas' | 'teclados' | 'mouses' | 'audio' | 'sillas' | 'monitores'
