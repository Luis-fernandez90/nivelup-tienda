// datos.ts — el catálogo semilla (Clase 1: "contrato + catálogo semilla").
// Todavía no hay conexión a ninguna API (eso llega en la Clase 7), así que
// por ahora la tienda arranca con este array fijo, tipado con Producto para
// que cualquier campo que falte o esté mal escrito lo marque el compilador.
import type { Producto } from './tipos'

export const productos: Producto[] = [
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
