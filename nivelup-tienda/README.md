# NivelUp — tienda gamer (proyecto React)

Proyecto individual del **bloque de React** del bootcamp FrontEnd (Desarrollo Web FullStack
con Java, G16), basado en la ruta de 12 clases de
[techcart-react-clases](https://github.com/EdHuayllasco/techcart-react-clases). Es una tienda
propia — no una copia de la tienda de ejemplo del profesor — con la misma idea: artículos
gamer (teclados, mouses, audio, sillas, monitores).

## Estado actual: hasta la Clase 5 de React

El bloque tiene 12 clases y el proyecto se arma **progresivamente**, clase por clase, igual
que se hizo con el proyecto de fundamentos (HTML/CSS/JS/TypeScript). Esto es lo que ya está
construido:

| Clase | Tema | Qué se agregó acá |
|:--:|---|---|
| 1 | Vite + React + TypeScript + JSX | El proyecto en sí, el contrato (`tipos.ts`) y el catálogo semilla (`datos.ts`). |
| 2 | Componentes funcionales + props tipadas | `Header`, `Footer`, `ProductCard` como componentes separados, cada uno con su `interface Props`. |
| 3 | Renderizado condicional + de listas | `StockBadge` (devuelve `null` cuando no aplica), el estado vacío del catálogo, y el `.map()` con `key` de las tarjetas y las categorías. |
| 4 | Manejo de eventos + `useState` | El carrito: agregar, sumar, restar, quitar, vaciar, y abrir/cerrar el panel — todo con `useState` en `App.tsx`. |
| 5 | `useState` II: estado derivado + buscador | `categoriaActiva` y `termino` son los únicos datos guardados; la lista visible y las categorías se **calculan** en cada render, nunca se guardan aparte. |

Lo que **todavía no existe** (porque no se dictó en clase): `useEffect`, persistencia en
`localStorage`, conexión a una API real, React Router, formularios controlados, Context /
custom hooks, JWT ni despliegue. Se va a ir agregando clase por clase, con su propio commit,
a medida que el curso avance — igual que se hizo con el proyecto de fundamentos.

## Cómo correrlo

Hace falta [Node.js](https://nodejs.org) (LTS) instalado.

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`).

## Estructura

```
src/
  tipos.ts        el contrato: Producto, ItemCarrito
  datos.ts        el catálogo semilla (fijo, sin API todavía)
  formato.ts       cómo se muestran los precios
  carrito.ts       las reglas del carrito, en funciones puras (sin useState acá)
  components/
    Header.tsx
    Footer.tsx
    ProductCard.tsx
    StockBadge.tsx
    CartPanel.tsx
  App.tsx          el estado (useState) y el estado derivado
  main.tsx         el punto de entrada
```
