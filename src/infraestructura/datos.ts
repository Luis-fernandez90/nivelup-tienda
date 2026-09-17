// Productos del catálogo. No existe una API pública de productos gamer
// con nuestra marca, así que simulamos la carga con una Promise (con
// demora y posibilidad de fallo) como si fuera un fetch real.

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

// Si la URL tiene ?fallar=1, simula que la carga del catálogo falla
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

   // Si se cancela la petición, dejamos de esperar.
    signal?.addEventListener('abort', () => {
      clearTimeout(espera)
      reject(new DOMException('Solicitud cancelada', 'AbortError'))
    })
  })
}

// Busca un producto por id para la página de detalle.
export function obtenerProductoPorId(id: number, signal?: AbortSignal): Promise<Producto | undefined> {
  return obtenerProductos(signal).then((lista) => lista.find((p) => p.id === id))
}
