// datos.ts — el catálogo (Clase 1: "contrato + catálogo semilla"; Clase 6:
// "API + estados de carga"). El array de acá abajo sigue siendo nuestra
// única fuente de productos — no cambiamos el catálogo en sí — pero ya NO
// se exporta directo. Se pide con `obtenerProductos()`, que devuelve una
// Promise: el mismo contrato que tendría un `fetch` de verdad.
//
// ¿Por qué simular la red en vez de pedirle los productos a una API real?
// Porque NivelUp no tiene un backend propio que sirva "teclados NexoGear"
// — el login sí pega contra una API real (DummyJSON, ver
// infraestructura/auth.ts), pero un catálogo de productos gamer con nuestra
// propia marca no existe en ningún servidor público. Así que reproducimos
// acá el mismo mecanismo que tendría un fetch real: una Promise que tarda,
// que puede rechazar, y que se puede cancelar con un AbortSignal — para que
// el resto de la app (Home, Detalle) esté escrito exactamente como si
// estuviera hablando con un servidor.
import type { Producto } from '../dominio/tipos'

const productos: Producto[] = [
  {
    id: 1,
    nombre: 'Teclado mecánico Vortex TKL',
    marca: 'NexoGear',
    precio: 349.9,
    imagen: 'https://placehold.co/400x400/18181b/e4e4e7?text=Vortex+TKL',
    stock: 8,
    categoria: 'teclados',
  },
  {
    id: 2,
    nombre: 'Mouse inalámbrico Raptor X',
    marca: 'NexoGear',
    precio: 189.9,
    imagen: 'https://placehold.co/400x400/18181b/e4e4e7?text=Raptor+X',
    stock: 3,
    categoria: 'mouses',
  },
  {
    id: 3,
    nombre: 'Audífonos gamer EchoPulse 7.1',
    marca: 'SonoLab',
    precio: 259.9,
    imagen: 'https://placehold.co/400x400/18181b/e4e4e7?text=EchoPulse+7.1',
    stock: 15,
    categoria: 'audio',
  },
  {
    id: 4,
    nombre: 'Silla ergonómica ThronePro',
    marca: 'Rugor',
    precio: 899.9,
    imagen: 'https://placehold.co/400x400/18181b/e4e4e7?text=ThronePro',
    stock: 0,
    categoria: 'sillas',
  },
  {
    id: 5,
    nombre: 'Monitor curvo 27" 165Hz ViewArc',
    marca: 'Pixion',
    precio: 1299.9,
    imagen: 'https://placehold.co/400x400/18181b/e4e4e7?text=ViewArc+27',
    stock: 4,
    categoria: 'monitores',
  },
  {
    id: 6,
    nombre: 'Mousepad XL RGB GlideZone',
    marca: 'NexoGear',
    precio: 79.9,
    imagen: 'https://placehold.co/400x400/18181b/e4e4e7?text=GlideZone+XL',
    stock: 20,
    categoria: 'mouses',
  },
  {
    id: 7,
    nombre: 'Teclado 60% inalámbrico Nimbus Mini',
    marca: 'NexoGear',
    precio: 429.9,
    imagen: 'https://placehold.co/400x400/18181b/e4e4e7?text=Nimbus+Mini',
    stock: 6,
    categoria: 'teclados',
  },
  {
    id: 8,
    nombre: 'Auriculares con micrófono VoxComm',
    marca: 'SonoLab',
    precio: 149.9,
    imagen: 'https://placehold.co/400x400/18181b/e4e4e7?text=VoxComm',
    stock: 10,
    categoria: 'audio',
  },
]

const RETARDO_MS = 700

// Truco para poder MOSTRAR el estado de error en la sustentación sin
// depender de desconectar el wifi: agregando `?fallar=1` al final de la
// URL forzamos el rechazo. Sin ese parámetro, se comporta como una carga
// normal — así que nunca aparece por accidente para un usuario real.
function debeSimularFallo(): boolean {
  return new URLSearchParams(window.location.search).get('fallar') === '1'
}

export function obtenerProductos(signal?: AbortSignal): Promise<Producto[]> {
  return new Promise((resolve, reject) => {
    const espera = setTimeout(() => {
      if (debeSimularFallo()) {
        reject(new Error('No se pudo conectar con el servidor de productos.'))
        return
      }
      resolve(productos)
    }, RETARDO_MS)

    // Si algo cancela el pedido (el componente se desmonta, o pedimos de
    // nuevo antes de que termine el anterior), no seguimos esperando ni
    // resolvemos con datos que ya nadie quiere.
    signal?.addEventListener('abort', () => {
      clearTimeout(espera)
      reject(new DOMException('Solicitud cancelada', 'AbortError'))
    })
  })
}

// Para la página de detalle (/producto/:id): mismo mecanismo, filtrado a
// un solo producto. `undefined` si el id no existe en el catálogo.
export function obtenerProductoPorId(id: number, signal?: AbortSignal): Promise<Producto | undefined> {
  return obtenerProductos(signal).then((lista) => lista.find((p) => p.id === id))
}
