import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { CarritoProvider } from './aplicacion/carrito_context.tsx'
import { SessionProvider } from './aplicacion/session_context.tsx'

// StrictMode monta los componentes DOS VECES en desarrollo (nunca en
// producción) a propósito, para exponer efectos secundarios que no deberían
// pasar dos veces (por eso session_context.tsx cancela con AbortController
// y clearTimeout en su cleanup — así el doble montaje no deja fugas).
//
// Clase 6/7: <BrowserRouter>, <CarritoProvider> y <SessionProvider>
// envuelven a <App/> acá, no adentro de App. Así cualquier componente del
// árbol (incluido App) puede usar rutas, leer el carrito y leer la sesión.
// El orden entre Carrito y Session no importa — no dependen uno del otro.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </CarritoProvider>
    </BrowserRouter>
  </StrictMode>,
)
