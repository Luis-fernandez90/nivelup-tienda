// tipos.ts — el contrato de la tienda: la forma de un Producto se define
// UNA vez acá, y todo lo demás (catálogo, tarjetas, carrito) la importa en
// vez de repetirla.
export interface Producto {
  id: number
  nombre: string
  marca: string
  precio: number
  imagen: string
  stock: number
  categoria: string
}

// Un ítem del carrito no es un Producto completo: solo lo que se muestra y
// se calcula ahí (nombre, precio, cantidad). Guardar el producto entero
// sería arrastrar datos que el carrito nunca usa.
export interface ItemCarrito {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

// Las categorías del catálogo: "todas" siempre existe (filtro por
// defecto) más las categorías reales de datos.ts.
export type CategoriaId = 'todas' | 'teclados' | 'mouses' | 'audio' | 'sillas' | 'monitores'

// Estado de un pedido de red: unión de literales en vez de un boolean
// "cargando: true/false", porque acá hay tres estados posibles (cargando,
// listo, error) y se excluyen entre sí.
export type EstadoCarga = 'cargando' | 'listo' | 'error'

// Lo que pide el formulario de checkout. Tipo separado de Producto e
// ItemCarrito porque describe otra cosa: la persona que compra, no un
// producto.
export interface DatosEnvio {
  nombre: string
  email: string
  direccion: string
  telefono: string
}

// Un pedido ya confirmado: los datos de envío + los items del carrito en
// ese momento + el total. Queda guardado así aunque después el carrito se
// vacíe o el catálogo cambie.
export interface Pedido {
  id: number
  fecha: string
  cliente: DatosEnvio
  items: ItemCarrito[]
  total: number
}

// Lo que la app necesita saber de quién inició sesión (no es lo mismo que
// lo que devuelve la API, eso se queda en infraestructura/auth.ts).
// expiraEn es un timestamp en milisegundos para poder cerrar la sesión
// sola cuando vence.
export interface Usuario {
  id: number
  nombre: string
  email: string
  token: string
  expiraEn: number
}