// Botón flotante para prender/apagar la música de fondo. Los navegadores no
// dejan que el audio empiece solo, por eso necesita un clic del usuario.
import { useRef, useState } from 'react'
import pistaFondo from '../../assets/audio/musica-fondo.mp3'

export default function ControlMusica() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [sonando, setSonando] = useState(false)

  function alternar() {
    if (!audioRef.current) return
    if (sonando) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setSonando(!sonando)
  }

  return (
    <>
      <audio ref={audioRef} src={pistaFondo} loop />
      <button
        type="button"
        onClick={alternar}
        aria-label={sonando ? 'Silenciar música' : 'Activar música'}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/40 bg-zinc-900/90 text-xl text-violet-400 shadow-lg backdrop-blur transition hover:scale-110 hover:border-violet-400"
      >
        {sonando ? '🔊' : '🔇'}
      </button>
    </>
  )
}