import { useState } from 'react'
import ReactPlayer from 'react-player'
import { tracks } from './data' // Importamos tu "base de datos"
import './App.css'

function App() {
  // Estado 1: ¿Qué canción está sonando? (Empieza con la primera, índice 0)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  // Estado 2: ¿Estamos en Play o Pausa? (Empieza pausado)
  const [isPlaying, setIsPlaying] = useState(false);

  // Variable auxiliar para acceder a los datos de la canción actual facilmente
  const activeTrack = tracks[currentTrackIndex];

  // Función para cambiar de canción (Next / Prev)
  const handleNextTrack = () => {
    setIsPlaying(false); // Pausa al cambiar para evitar caos
    // Si llegamos al final, vuelve al 0, si no, suma 1
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  return (
    <div className="layout-container">
      
      {/* --- SECCIÓN DE VISUALES (GRID) --- */}
      <div className="visuals-grid">
        {/* Aquí ocurre la magia: Mapeamos los visuales de la Pista ACTIVA */}
        {activeTrack.visuals.map((videoId, index) => (
          <div key={index} className="video-wrapper">
             <ReactPlayer 
                url={`https://www.youtube.com/watch?v=${videoId}`}
                playing={isPlaying} // Los videos obedecen al Play Global
                muted={true}        // OBLIGATORIO: YouTube no deja autoplay con sonido
                controls={false}    // Oculta la barra de YouTube para que se vea limpio
                width="100%"
                height="100%"
                loop={true}
             />
          </div>
        ))}
      </div>

      {/* --- REPRODUCTOR MAESTRO (AUDIO) --- */}
      <div className="master-player">
        {/* Reproductor invisible de audio (el que suena de verdad) */}
        <ReactPlayer 
            url={activeTrack.audioSrc}
            playing={isPlaying}
            width="0" 
            height="0"
            onEnded={handleNextTrack} // Pasa a la siguiente al terminar
        />

        {/* Interfaz de Usuario (Botones Minimalistas) */}
        <div className="controls">
            <h3>{activeTrack.title}</h3>
            
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>

            <button onClick={handleNextTrack}>
              NEXT TRACK
            </button>
        </div>
      </div>

    </div>
  )
}

export default App