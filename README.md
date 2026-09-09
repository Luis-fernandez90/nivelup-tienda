# NivelUp — tienda gamer (proyecto React)

Proyecto individual del **bloque de React** del bootcamp FrontEnd (Desarrollo Web FullStack
con Java, G16), basado en la ruta de 12 clases de
[techcart-react-clases](https://github.com/EdHuayllasco/techcart-react-clases). Es una tienda
propia — no una copia de la tienda de ejemplo del profesor — con la misma idea: artículos
gamer (teclados, mouses, audio, sillas, monitores).

## Estado actual: hasta la Clase 8 de React

El bloque tiene 12 clases y el proyecto se arma **progresivamente**, clase por clase, igual
que se hizo con el proyecto de fundamentos (HTML/CSS/JS/TypeScript). Esto es lo que ya está
construido:

| Clase | Tema | Qué se agregó acá |
|:--:|---|---|
| 1 | Vite + React + TypeScript + JSX | El proyecto en sí, el contrato (`tipos.ts`) y el catálogo semilla (`datos.ts`). |
| 2 | Componentes funcionales + props tipadas | `Header`, `Footer`, `ProductCard` como componentes separados, cada uno con su `interface Props`. |
| 3 | Renderizado condicional + de listas | `StockBadge` (devuelve `null` cuando no aplica), el estado vacío del catálogo, y el `.map()` con `key` de las tarjetas y las categorías. |
| 4 | Manejo de eventos + `useState` | El carrito: agregar, sumar, restar, quitar, vaciar, y abrir/cerrar el panel. |
| 5 | `useState` II: estado derivado + buscador | `categoriaActiva` y `termino` son los únicos datos guardados; la lista visible y las categorías se **calculan** en cada render, nunca se guardan aparte. |
| 6 | Context API + React Router + Checkout | El carrito vive en `CarritoProvider` (`aplicacion/carrito_context.tsx`) + `useCarrito()`. `App` define rutas: `Layout` (Header + `Outlet` + Footer) envuelve `Home` (el catálogo) y `Checkout` (formulario controlado, guarda el pedido en `localStorage`). `ProductCard` y `CartPanel` ya leen el carrito directo del Context, sin recibir nada por props. |
| 7 | Arquitectura hexagonal + JWT + rutas protegidas | Todo el código se reorganizó en 4 carpetas (`dominio`/`infraestructura`/`aplicacion`/`ui`, ver abajo). Login real contra [DummyJSON](https://dummyjson.com/docs/auth) (`infraestructura/auth.ts`), sesión con `SessionProvider` + `useSesion()` que se **cierra sola cuando el token vence** (`useEffect` + `setTimeout` + `AbortController`), persistida en `localStorage` con validación estricta de tipos (`infraestructura/almacen.ts`). `/checkout` queda protegido con `RutaProtegida` — sin sesión, redirige a `/login` y vuelve a donde estabas después de loguearte. Variables de entorno (`VITE_API_URL`) vía `.env` (no se sube — `.env.example` sí). |
| 8 | Rendimiento + deploy | `ProductCard` envuelto en `memo`; el filtro del catálogo (`visibles`) en `useMemo`; `Login` y `Checkout` cargados con `React.lazy` + `Suspense` (no van en el bundle inicial, porque no todos los visitan). `vercel.json` con la regla de rewrite, y proyecto ya desplegado en Vercel: **[nivelup-tienda.vercel.app](https://nivelup-tienda.vercel.app)**. |

Lo que **todavía no existe** (no se dictó en clase, o no alcanzó el tiempo): registro de
usuario nuevo (`/registro`), y recetas/otro dominio de ejemplo del profesor (no aplica, es de su
propio proyecto demo).

**Probado en este entorno:** `tsc --noEmit` sin errores propios del código (solo ruido de
falta de `@types/react` en el sandbox de verificación, que en tu máquina sí está instalado);
render de `Home`, `Header`, `Login`, `CartPanel`, `Checkout` con datos reales; la lógica de
`validar()` del checkout y la de expiración de sesión, probadas con casos concretos. **Lo que
NO se pudo probar acá** (porque este entorno no tiene acceso a internet ni puede correr Vite
de verdad): el login contra DummyJSON en un navegador real, y el ciclo completo de expiración
de sesión en vivo. Probalo vos con `npm run dev` antes de la sustentación.

## Cómo correrlo

Hace falta [Node.js](https://nodejs.org) (LTS) instalado. `react-router-dom` ya está en
`package.json` desde el principio, así que no hace falta instalar nada nuevo.

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`). Para loguearte,
usá el usuario de prueba de DummyJSON: `emilys` / `emilyspass`.

## Estructura (arquitectura hexagonal, desde Clase 7)

```
src/
  dominio/                    reglas puras, sin nada de React ni de la API
    tipos.ts                  el contrato: Producto, ItemCarrito, DatosEnvio, Pedido, Usuario
    carrito.ts                las reglas del carrito, en funciones puras

  infraestructura/            todo lo que habla con el "afuera" (API, localStorage)
    datos.ts                  el catálogo semilla (fijo, sin API todavía)
    pedidos.ts                leer/guardar pedidos confirmados en localStorage
    auth.ts                   login + validación de token contra DummyJSON (adaptador)
    almacen.ts                leer/guardar/borrar la sesión en localStorage

  aplicacion/                 los "casos de uso": Context + custom hooks
    carrito_context.tsx       CarritoProvider — acá vive el useState del carrito
    useCarrito.ts             hook para leer el carrito desde cualquier componente
    session_context.tsx       SessionProvider — sesión + auto-cierre cuando vence el token
    useSesion.ts              hook para leer la sesión desde cualquier componente

  ui/                         todo lo que se pinta en pantalla
    formato.ts                cómo se muestran los precios
    components/
      Layout.tsx               Header + <Outlet/> + Footer
      Header.tsx               carrito + sesión (NavLink, Hola/Salir o Inicia sesión)
      RutaProtegida.tsx         guardia: sin sesión, redirige a /login
      Footer.tsx
      ProductCard.tsx           memo(); lee el carrito del Context
      StockBadge.tsx
      CartPanel.tsx             lee el carrito del Context; botón "Ir a pagar"
    pages/
      Home.tsx                  catálogo, filtros, buscador (useMemo)
      Checkout.tsx               formulario controlado + validación (ruta protegida)
      Login.tsx                  login (lazy)

  App.tsx        define las rutas (<Routes>/<Route>, con lazy + Suspense)
  main.tsx       envuelve <App/> en BrowserRouter → CarritoProvider → SessionProvider
  vite-env.d.ts  tipa las variables de entorno (import.meta.env.VITE_API_URL)

.env.example     nombres de variables (VITE_API_URL) — .env real NO se sube (está en .gitignore)
vercel.json      regla de rewrite para que las rutas de React Router no den 404 en producción
```

## Deploy

Desplegado en Vercel: **https://nivelup-tienda.vercel.app**

Se conectó el repo de GitHub directo desde Vercel (framework detectado automáticamente: Vite),
con la variable de entorno `VITE_API_URL=https://dummyjson.com` configurada ahí mismo. El
`vercel.json` de la raíz tiene la regla de rewrite que evita el 404 al recargar una ruta que no
es la home (por ejemplo `/checkout`), porque React Router maneja las rutas del lado del
cliente. Cada `git push` a `main` dispara un deploy nuevo automáticamente.
## Ejercicios extra (useReducer + accesibilidad)

Sobre el reducer (carrito y filtros): antes, cada dato se guardaba y se cambiaba por su cuenta, cada uno en su propio lugar. Ahora hay un solo punto que recibe el pedido y decide qué hacer con él. Es como tener un solo encargado atendiendo todos los pedidos, en vez de que cada uno se resuelva por separado — así es más fácil saber qué pasó y no se pisan los cambios entre sí.

Sobre el foco automático del carrito: pensé en alguien que navega la página solo con el teclado, sin mouse, o con un lector de pantalla. Antes, si abría el carrito, no había ninguna señal de que algo nuevo apareció. Ahora, apenas se abre, la atención salta directo al título "Tu carrito" — como avisarle "mira, esto se acaba de abrir". Es una mejora de accesibilidad.