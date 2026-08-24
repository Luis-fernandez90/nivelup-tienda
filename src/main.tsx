import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode monta los componentes DOS VECES en desarrollo (nunca en
// producción) a propósito, para exponer efectos secundarios que no deberían
// pasar dos veces. Todavía no usamos useEffect (eso es más adelante), pero
// dejamos StrictMode activado desde el día uno porque así viene la
// plantilla oficial de Vite + React.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
