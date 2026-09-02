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

// ---------- Checkout (Clase 6) ----------

// Lo que pide el formulario de checkout. Es su PROPIO tipo, separado de
// Producto e ItemCarrito, porque describe otra cosa: no un producto, sino
// a la persona que compra.
export interface DatosEnvio {
  nombre: string
  email: string
  direccion: string
  telefono: string
}

// Un pedido ya confirmado: los datos de envío + una foto del carrito en
// ese momento + el total. Se guarda tal cual quedó, aunque después el
// carrito se vacíe o el catálogo cambie.
export interface Pedido {
  id: number
  fecha: string
  cliente: DatosEnvio
  items: ItemCarrito[]
  total: number
}

// ---------- Sesión / login (Clase 7) ----------

// Esto es lo que la APP necesita saber de quién inició sesión — NO es lo
// mismo que lo que devuelve la API cruda (eso vive, sin exportarse, en
// infraestructura/auth.ts). `expiraEn` es un timestamp en milisegundos
// (Date.now() + los minutos que dura el token), para poder cerrar la
// sesión sola cuando vence.
export interface Usuario {
  id: number
  nombre: string
  email: string
  token: string
  expiraEn: number
}
