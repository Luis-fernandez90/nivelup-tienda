# Guía para la sustentación — NivelUp

Formato que mencionó el profesor: **10 minutos** → ~5 min de demo del producto + ~5 min de
preguntas técnicas. Esta guía tiene un guion para la parte 1 y respuestas armadas para la parte 2,
basadas en lo que realmente construiste (nada genérico).

---

## Parte 1 — Guion de demo (5 min)

No leas esto en voz alta, es para que tengas el orden en la cabeza. Andá narrando qué hace la app
mientras la usás, no solo clickeando en silencio.

1. **Abrí `https://nivelup-tienda.vercel.app`** (no localhost — mostrá que está desplegado de verdad).
   - "Esta es NivelUp, una tienda de artículos gamer. Está desplegada en Vercel y conectada a mi repo de GitHub — cada push a main dispara un deploy nuevo."

2. **Catálogo (Home)**
   - Filtrá por categoría (ej. "Teclados") y usá el buscador.
   - "El filtro y la búsqueda no se guardan como una lista aparte — `categoriaActiva` y `término` son el único estado, y la lista visible se recalcula en cada render con `useMemo`, para no repetir ese cálculo si nada cambió."

3. **Carrito**
   - Agregá 2-3 productos, sumá/restá cantidad, mostrá el subtotal.
   - "El carrito vive en un Context (`CarritoProvider`), así que `ProductCard` y el panel del carrito lo leen directo con `useCarrito()`, sin pasarse props entre componentes que no tienen relación directa."

4. **Intentá ir a Checkout sin loguearte**
   - Clickeá "Ir a pagar" **sin haber iniciado sesión antes** (si ya quedó logueado de una prueba anterior, abrí una ventana de incógnito).
   - Te redirige a `/login`. "Esto es `RutaProtegida` — si no hay sesión, redirige a login, y guarda de dónde venías (`state: { desde }`) para volver ahí después de loguearte."

5. **Login**
   - Usuario `emilys`, contraseña `emilyspass`.
   - "Esto pega contra la API real de DummyJSON, no es un login simulado. Te devuelve un JWT de verdad."
   - Te devuelve automáticamente a Checkout (por el `desde` del paso anterior).

6. **Checkout**
   - Completá el formulario, mostrá que si dejás un campo vacío y salís (blur) aparece el error.
   - Confirmá el pedido → mensaje de éxito, carrito vacío.
   - "La validación se muestra recién cuando el usuario sale del campo (`onBlur`), no antes — así no lo bombardeo de errores mientras todavía está escribiendo."

7. **Refrescá la página estando en `/checkout` (F5)**
   - No da 404. "Esto es gracias al `vercel.json` — le dice al servidor que cualquier ruta devuelva `index.html`, porque las rutas las maneja React Router del lado del cliente, no el servidor."

8. **Cerrá sesión** ("Salir" en el header) para dejar mostrado que el botón de login vuelve a aparecer.

Si el profesor no interrumpe antes, con eso ya cubriste: catálogo, carrito, Context, rutas
protegidas, login JWT real, checkout con validación, y deploy — en 5 minutos.

---

## Parte 2 — Preguntas técnicas probables

### Context API

**¿Por qué Context y no pasar todo por props?**
El carrito y la sesión los necesitan componentes que están en partes muy distintas del árbol
(`Header`, `ProductCard`, `CartPanel`, `Checkout`) y que no tienen relación de padre-hijo directa
entre sí. Pasarlo todo por props significaría atravesar componentes intermedios que ni usan esos
datos, solo los reciben para pasarlos más abajo ("prop drilling"). Con Context, cualquier
componente que esté dentro del `Provider` puede leer el valor con `useContext`, sin que los de en
medio se enteren.

**¿Por qué armaste un hook custom (`useCarrito`, `useSesion`) en vez de usar `useContext` directo?**
Dos razones: primero, evita repetir `useContext(CarritoContext)` en cada componente. Segundo — la
más importante — el hook tira un error explícito si alguien lo usa fuera del `Provider` (`if
(!contexto) throw new Error(...)`). Sin eso, usar el contexto fuera del Provider te da `undefined`
silenciosamente y el error real aparece más adelante, en otro lado, más difícil de rastrear.

**¿Por qué dos Contexts separados (carrito y sesión) y no uno solo?**
Son datos que cambian por separado y que consumen componentes distintos. Si estuvieran juntos en
un solo Context, cualquier cambio de sesión haría re-renderizar también a todo lo que solo lee el
carrito (y viceversa), aunque a ese componente no le importe la sesión.

### React Router

**¿Cómo funciona `RutaProtegida`?**
Es un componente que se usa como elemento de una `Route` padre. Lee `usuario` de `useSesion()`; si
no hay usuario, devuelve `<Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />`
en vez del contenido. Si hay usuario, devuelve `<Outlet />`, que es donde React Router renderiza la
ruta hija (en este caso, Checkout). El `replace` evita que quede en el historial la entrada a la
ruta protegida fallida (si no, el botón "atrás" del navegador te devolvería justo a esa redirección).

**¿Qué pasa si escribís `/checkout` directo en la URL sin haber navegado desde la app?**
Lo mismo: `RutaProtegida` corre igual porque es la que decide qué renderizar para esa ruta, no
importa cómo llegaste ahí. Si no hay sesión, redirige a `/login`.

**¿Por qué `Layout` con `Outlet` en vez de repetir Header/Footer en cada página?**
`Layout` envuelve todas las rutas hijas: define Header + `<Outlet/>` + Footer una sola vez, y cada
página (`Home`, `Checkout`, `Login`) solo define lo que le es propio. Si mañana cambia el diseño
del header, se cambia en un solo lugar.

### Arquitectura hexagonal

**Explicá las 4 carpetas.**
- `dominio/`: reglas y tipos puros — sin nada de React, sin `fetch`, sin `localStorage`. Es lo más
  estable, lo que no debería cambiar aunque cambie la API o la librería de UI.
- `infraestructura/`: todo lo que habla con el "afuera" — la API de DummyJSON (`auth.ts`) y
  `localStorage` (`almacen.ts`, `pedidos.ts`). Si mañana cambio de API o de forma de guardar datos,
  toco solo acá.
- `aplicacion/`: los casos de uso — los Context providers y sus hooks. Conectan el dominio con la
  infraestructura y exponen lo que la UI necesita (`agregar`, `entrar`, `salir`, etc.).
- `ui/`: componentes y páginas — lo único que sabe que existe React, JSX, Tailwind.

**¿Por qué importa esta separación y no es "solo crear carpetas"?**
Porque la dependencia va en una sola dirección: `ui` depende de `aplicacion`, que depende de
`dominio` e `infraestructura` — pero `dominio` no depende de nada de eso. Un ejemplo concreto: en
`infraestructura/auth.ts` hay una interfaz `RespuestaLogin` que representa exactamente lo que
devuelve la API de DummyJSON (nombres en inglés, campos que no me interesan) — esa interfaz **no
se exporta**. Lo único que sale de ese archivo hacia el resto de la app es `Usuario` (el tipo de
`dominio/tipos.ts`). Es el patrón adaptador: si mañana cambio de API, solo edito `auth.ts` — el
resto de la app ni se entera de que cambió la forma de los datos.

### JWT / Login / Sesión

**¿Qué es un JWT y por qué "el token va en el header, no en la URL"?**
Un JWT tiene 3 partes separadas por puntos (header.payload.signature) y está **firmado, no
encriptado** — cualquiera que lo intercepte puede leer el contenido, así que nunca debería llevar
datos secretos. Va en el header `Authorization: Bearer <token>` porque las URLs quedan logueadas en
muchos lugares (historial del navegador, logs de servidores, proxies) — si el token estuviera en la
URL, quedaría expuesto en todos esos lugares.

**¿Cómo se cierra sola la sesión cuando vence el token?**
En `SessionProvider` hay un `useEffect` que corre cada vez que cambia `usuario`. Calcula
`restante = usuario.expiraEn - Date.now()`. Si ya venció, borra la sesión al toque. Si no, arma un
`setTimeout(restante)` que borra la sesión cuando llegue ese momento, y además llama a
`obtenerPerfil()` para validar el token contra la API ahora mismo (por si el token es inválido por
otra razón, no solo por tiempo). El `useEffect` devuelve una función de limpieza que cancela el
`setTimeout` y aborta el fetch con `AbortController` — así, si el usuario cierra sesión manualmente
o el componente se desmonta antes de que se cumpla el tiempo, no queda un timer corriendo de más ni
un fetch que intenta actualizar un estado que ya no existe.

**¿Dónde se guarda la sesión y qué pasa si alguien edita el `localStorage` a mano?**
Se guarda en `localStorage` bajo la clave `nivelup_sesion`. Al leerla (`leerSesion()`), se valida en
tiempo de ejecución que tenga la forma esperada (`typeof datos.token !== 'string'`, `typeof
datos.expiraEn !== 'number'`, etc.) — si alguien edita el `localStorage` a mano y lo rompe, la app
no explota: simplemente trata esa sesión como inválida.

### Rendimiento

**¿Qué hace `memo()` en `ProductCard` y cuándo ayuda?**
`memo` hace que el componente no vuelva a renderizar si sus props no cambiaron (comparación
superficial). Ayuda cuando el padre re-renderiza seguido pero las props de ese hijo en particular
no cambian — por ejemplo, si el catálogo tiene 20 productos y solo cambia el estado de uno,
`memo` evita recalcular los otros 19.

**Ojo con esta pregunta trampa:** ¿`memo` evita que `ProductCard` se re-renderice cuando cambia el
carrito? No — porque `ProductCard` lee el carrito directo del Context con `useCarrito()`. Cuando el
Context cambia, todos sus consumidores se re-renderizan sin importar `memo`, porque no es un cambio
de props, es un cambio de contexto. `memo` solo bloquea re-renders que vienen del padre por props
que no cambiaron.

**¿Para qué el `useMemo` en el catálogo?**
Filtra `productos` por categoría y término de búsqueda. Sin `useMemo`, ese filtro se recalcularía
en cada render del componente, aunque ni la categoría ni el término hayan cambiado (por ejemplo, si
el componente re-renderiza porque cambió el carrito). Con `useMemo([categoriaActiva, termino])`,
solo se recalcula cuando esos dos valores cambian.

**¿Por qué `lazy` en Login y Checkout pero no en Home?**
Home es lo primero que ve cualquier visitante — no tiene sentido retrasarlo. Login y Checkout no
los usa todo el mundo (alguien que solo mira el catálogo nunca los visita), así que separarlos en
su propio chunk con `React.lazy` + `Suspense` reduce el JavaScript que se descarga en la primera
carga. Se descargan recién cuando el usuario navega a esas rutas.

### Variables de entorno / Deploy

**¿Para qué `VITE_API_URL` en vez de escribir la URL de la API directo en el código?**
Para no hardcodear un valor que podría cambiar entre entornos (desarrollo local, producción). Vite
expone las variables que empiezan con `VITE_` a través de `import.meta.env`. Además, en `auth.ts`
hay un valor de respaldo (`|| 'https://dummyjson.com'`) para que la app no se rompa si alguien
clona el repo y todavía no creó su `.env`.

**¿Cómo funciona el deploy en Vercel?**
Vercel está conectado directo al repo de GitHub — detectó automáticamente que es un proyecto Vite.
Cada `git push` a `main` dispara un build y deploy nuevos. La variable `VITE_API_URL` se configuró
en el panel de Vercel, no en un archivo que se sube al repo (el `.env` real nunca se sube, está en
`.gitignore`).

**¿Por qué hacía falta el `vercel.json`?**
Porque React Router maneja las rutas en el navegador (client-side routing) — no existen archivos
reales en el servidor para `/checkout` o `/login`. Sin la regla de rewrite, si alguien entra directo
a `nivelup-tienda.vercel.app/checkout` o lo recarga con F5, el servidor busca un archivo que no
existe y devuelve 404. El `vercel.json` le dice al servidor: cualquier ruta, devolvé `index.html`
igual — y ahí React Router, ya corriendo en el navegador, se encarga de mostrar la página correcta.

---

## Si te preguntan algo que no sabés

No inventes. Es mejor decir "esa parte específica no la tengo tan clara, pero lo que sí puedo
explicar es..." y redirigir a algo que sí dominás, que trabarte inventando una respuesta. El
profesor calibra las preguntas según cómo vas respondiendo — si contestás con seguridad las
primeras, probablemente no vaya a un nivel mucho más difícil.

## Antes de entrar

- Tené la app abierta en una pestaña ya en `nivelup-tienda.vercel.app` (no localhost).
- Tené el código abierto en VS Code por si te piden mostrar algún archivo puntual (`auth.ts`,
  `session_context.tsx`, `RutaProtegida.tsx` son los que más probablemente pidan ver).
- Una ventana de incógnito lista, por si necesitás mostrar el flujo de login desde cero (sin
  sesión guardada).
