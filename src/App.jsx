import { useEffect, useRef, useState } from 'react'
import YouTube from 'react-youtube'
import './App.css'

// --- TUS DATOS ---
const tracks = [
  {
    id: 1,
    title: "yurei + @britneygore",
    audioSrc: "/audio/beat1.mp3", 
    visuals: ["e6mSd15uhPY", "ZXeQ8TlD-NU", "e6mSd15uhPY"]
  },
  {
    id: 2,
    title: "yurei + @vipkimzhel + @britneygore",
    audioSrc: "/audio/beat2.mp3",
    visuals: ["ZXeQ8TlD-NU", "e6mSd15uhPY", "ZXeQ8TlD-NU"]
  },
  {
    id: 3,
    title: "yurei + @nulko1 + @britneygore",
    audioSrc: "/audio/beat3.mp3",
    visuals: ["e6mSd15uhPY", "ZXeQ8TlD-NU", "e6mSd15uhPY"]
  }
];

// --- COMPONENTE SYNC VIDEO ---
const SyncVideo = ({ videoId, isPlaying, onLoaded }) => {
  const playerRef = useRef(null);
  const hasLoadedRef = useRef(false);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0, 
      controls: 0, 
      rel: 0,      
      showinfo: 0,
      mute: 1,     
      loop: 1,     
      playlist: videoId, 
      modestbranding: 1,
      origin: window.location.origin
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    event.target.mute(); 
    
    if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
        onLoaded(); 
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  return (
    <YouTube 
      videoId={videoId} 
      opts={opts} 
      onReady={onReady}
      className="youtube-iframe-wrapper"
    />
  );
};


// --- APP PRINCIPAL ---
function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedVideosCount, setLoadedVideosCount] = useState(0);
  
  const audioRef = useRef(null);
  const activeTrack = tracks[currentTrackIndex];
  
  const totalVideos = activeTrack.visuals.length;
  const isReadyToPlay = loadedVideosCount >= totalVideos;
  
  const loadingPercentage = Math.min(100, Math.round((loadedVideosCount / totalVideos) * 100));

  const changeTrack = (newIndex) => {
    setIsPlaying(false);
    setLoadedVideosCount(0);
    setCurrentTrackIndex(newIndex);
  };

  const handleNext = () => changeTrack((currentTrackIndex + 1) % tracks.length);
  const handlePrev = () => changeTrack(currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1);

  const togglePlay = () => {
    if (isReadyToPlay) setIsPlaying(!isPlaying);
  };

  const handleVideoLoad = () => {
    setLoadedVideosCount((prev) => prev + 1);
  };

  // CONTROL DE AUDIO
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && isReadyToPlay) {
      setTimeout(() => {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
              playPromise.catch(e => console.log("Audio play error:", e));
          }
      }, 100); 
    } else {
      audio.pause();
    }
  }, [isPlaying, isReadyToPlay]);

  // Recarga al cambiar canción
  useEffect(() => {
    if(audioRef.current) {
      audioRef.current.load();
    }
  }, [currentTrackIndex]);


  return (
    <div className="layout-container">
      
      {/* --- 1. BANNER SUPERIOR (FIJO) --- */}
      <div className="ig-banner">
         <div className="banner-content">
            {[...Array(6)].map((_, i) => (
              <a key={i} href="https://www.instagram.com/fuckyurei" target="_blank" rel="noreferrer">
                @FUCKYUREI
              </a>
            ))}
         </div>
      </div>

      {/* --- GRID DE VISUALES --- */}
      <div className="visuals-grid">
        {!isReadyToPlay && (
           <div className="loading-overlay">
              <p>LOADING VISUALS... {loadingPercentage}%</p>
           </div>
        )}

        {activeTrack.visuals.map((videoId, index) => (
          <div key={`${activeTrack.id}-${index}-${videoId}`} className="video-wrapper">
             <SyncVideo 
                videoId={videoId} 
                isPlaying={isPlaying} 
                onLoaded={handleVideoLoad} 
             />
             <div className="click-blocker" style={{position:'absolute', inset:0, zIndex: 10}} />
          </div>
        ))}
      </div>

      {/* --- 2. BANNER INFERIOR (SOLO AL BAJAR) --- */}
      {/* Agregamos la clase 'bottom-mode' para que no sea fixed */}
      <div className="ig-banner bottom-mode">
         <div className="banner-content">
            {[...Array(6)].map((_, i) => (
              <a key={i} href="https://www.instagram.com/fuckyurei" target="_blank" rel="noreferrer">
                @FUCKYUREI
              </a>
            ))}
         </div>
      </div>

      {/* --- REPRODUCTOR MAESTRO --- */}
      <div className="master-player-container">
        <audio
            ref={audioRef}
            src={activeTrack.audioSrc}
            onEnded={handleNext}
        />

        <div className="controls-ui">
            {/* 1. IZQUIERDA: Info */}
            <div className="track-info">
              <h2>{activeTrack.title}</h2>
            </div>

            {/* 2. CENTRO: Logo Flotante */}
            <a href="https://www.instagram.com/vritni/" target="_blank" rel="noreferrer" className="center-logo">
               <img src="/vritniweb.png" alt="i love vritni" />
            </a>

            {/* 3. DERECHA: Botones */}
            <div className="buttons-row">
              <button onClick={handlePrev} className="nav-btn" disabled={!isReadyToPlay}>PREV</button>
              
              <button 
                  onClick={togglePlay} 
                  className="play-btn"
                  style={{ opacity: isReadyToPlay ? 1 : 0.5, cursor: isReadyToPlay ? 'pointer' : 'wait' }}
              >
                {isReadyToPlay ? (isPlaying ? "PAUSE" : "PLAY") : "LOADING..."}
              </button>
              
              <button onClick={handleNext} className="nav-btn" disabled={!isReadyToPlay}>NEXT</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default App