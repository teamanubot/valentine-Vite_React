import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function LoveLetterView({ recipientName }) {
    const [letterData, setLetterData] = useState(null)
    const [hearts, setHearts] = useState([])
    const [showMusicControl, setShowMusicControl] = useState(true)
    const [loading, setLoading] = useState(true)
    const [musicStarted, setMusicStarted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const [selectedImageIndex, setSelectedImageIndex] = useState(null)
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('valentine-dark-mode') === 'true'
    })
    const playerRef = React.useRef(null)

    useEffect(() => {
        // Fetch data from API
        fetch(`/api/love-letter/${recipientName}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setLetterData(data.data)
                }
                setLoading(false)
            })
            .catch(error => {
                console.error('Error:', error)
                setLoading(false)
            })

        // Generate floating hearts
        const heartArray = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 4,
        }))
        setHearts(heartArray)

        // Load YouTube IFrame API
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }, [recipientName])

    useEffect(() => {
        localStorage.setItem('valentine-dark-mode', darkMode)
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    const getYoutubeVideoId = (url) => {
        if (!url) return ''
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : ''
    }

    const initYouTubePlayer = (videoId) => {
        if (window.YT && window.YT.Player) {
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    loop: 1,
                    playlist: videoId,
                    controls: 0,
                    modestbranding: 1,
                    showinfo: 0
                },
                events: {
                    onReady: (event) => {
                        event.target.playVideo()
                    }
                }
            })
        } else {
            setTimeout(() => initYouTubePlayer(videoId), 100)
        }
    }

    const toggleMusic = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo()
            } else {
                playerRef.current.playVideo()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const openLightbox = (index) => {
        setSelectedImageIndex(index)
    }

    const closeLightbox = () => {
        setSelectedImageIndex(null)
    }

    const nextImage = () => {
        if (letterData?.images && selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % letterData.images.length)
        }
    }

    const prevImage = () => {
        if (letterData?.images && selectedImageIndex !== null) {
            setSelectedImageIndex(
                selectedImageIndex === 0 
                    ? letterData.images.length - 1 
                    : selectedImageIndex - 1
            )
        }
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #ffeef8 0%, #fff5f7 50%, #ffe8f0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Poppins', sans-serif",
            }}>
                <div className="text-center">
                    <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ color: '#c06c84', marginTop: '1rem' }}>Memuat surat cinta...</p>
                </div>
            </div>
        )
    }

    if (!letterData) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #ffeef8 0%, #fff5f7 50%, #ffe8f0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Poppins', sans-serif",
            }}>
                <div className="text-center">
                    <h2 style={{ color: '#c06c84', marginBottom: '2rem' }}>
                        Surat cinta tidak ditemukan 💔
                    </h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                        Belum ada surat cinta untuk "{recipientName}"
                    </p>
                    <a 
                        href="/love-letter" 
                        className="btn"
                        style={{
                            background: 'linear-gradient(135deg, #ff6b9d, #c06c84)',
                            color: 'white',
                            padding: '0.75rem 2rem',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        Buat Surat Cinta
                    </a>
                </div>
            </div>
        )
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

                body {
                    font-family: 'Poppins', sans-serif;
                    overflow-x: hidden;
                }

                .love-letter-container {
                    position: relative;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #ffeef8 0%, #fff5f7 50%, #ffe8f0 100%);
                    padding: 2rem;
                    overflow: hidden;
                }

                .love-letter-container.dark-mode {
                    background: linear-gradient(135deg, #1a0a1e 0%, #2d1b3d 50%, #3d1e3f 100%);
                }

                .floating-hearts {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }

                .heart {
                    position: absolute;
                    bottom: -50px;
                    font-size: 24px;
                    animation: float-up linear infinite;
                }

                @keyframes float-up {
                    0% {
                        bottom: -50px;
                        opacity: 0;
                        transform: translateX(0) rotate(0deg);
                    }
                    10% {
                        opacity: 0.8;
                    }
                    90% {
                        opacity: 0.8;
                    }
                    100% {
                        bottom: 110vh;
                        opacity: 0;
                        transform: translateX(50px) rotate(360deg);
                    }
                }

                .letter-content {
                    position: relative;
                    z-index: 2;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .letter-envelope {
                    background: white;
                    border-radius: 20px;
                    padding: 3rem;
                    box-shadow: 0 30px 80px rgba(255, 107, 157, 0.2);
                    position: relative;
                    animation: fadeIn 1s ease-out;
                }

                .dark-mode .letter-envelope {
                    background: rgba(45, 27, 61, 0.9);
                    border: 1px solid rgba(255, 107, 157, 0.3);
                    box-shadow: 0 30px 80px rgba(255, 107, 157, 0.3);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .letter-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding-bottom: 2rem;
                    border-bottom: 2px solid #ffe8f0;
                }

                .letter-to {
                    font-family: 'Dancing Script', cursive;
                    font-size: 3rem;
                    color: #ff6b9d;
                    margin-bottom: 0.5rem;
                }

                .dark-mode .letter-to {
                    color: #ff8cb3;
                }

                .letter-from {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    color: #c06c84;
                }

                .dark-mode .letter-from {
                    color: #d98ba6;
                }

                .letter-image {
                    width: 100%;
                    max-height: 400px;
                    object-fit: cover;
                    border-radius: 15px;
                    margin-bottom: 2rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .letter-message {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    line-height: 2;
                    color: #333;
                    text-align: justify;
                    margin-bottom: 2rem;
                    white-space: pre-wrap;
                }

                .dark-mode .letter-message {
                    color: #d1b3c4;
                }

                .letter-signature {
                    text-align: right;
                    margin-top: 3rem;
                }

                .signature-text {
                    font-family: 'Dancing Script', cursive;
                    font-size: 2rem;
                    color: #ff6b9d;
                }

                .dark-mode .signature-text {
                    color: #ff8cb3;
                }

                .dark-mode-toggle {
                    position: fixed;
                    bottom: 2rem;
                    left: 2rem;
                    background: linear-gradient(135deg, #ff6b9d, #c06c84);
                    color: white;
                    border: none;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(255, 107, 157, 0.4);
                    z-index: 9999;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dark-mode-toggle:hover {
                    transform: scale(1.1) rotate(15deg);
                    box-shadow: 0 15px 40px rgba(255, 107, 157, 0.6);
                }

                .dark-mode-toggle i {
                    font-size: 1.5rem;
                }

                .youtube-container {
                    position: relative;
                    width: 1px;
                    height: 1px;
                    overflow: hidden;
                    opacity: 0.01;
                    pointer-events: none;
                }

                .youtube-container iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                .music-control {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background: linear-gradient(135deg, #ff6b9d, #c06c84);
                    color: white;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(255, 107, 157, 0.4);
                    z-index: 1000;
                    transition: all 0.3s ease;
                }

                .music-control:hover {
                    transform: scale(1.1);
                    box-shadow: 0 15px 40px rgba(255, 107, 157, 0.5);
                }

                .music-control i {
                    font-size: 1.5rem;
                }

                .music-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 107, 157, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.5s ease-out;
                }

                .music-overlay-content {
                    text-align: center;
                    color: white;
                }

                .music-play-button {
                    background: white;
                    color: #ff6b9d;
                    border: none;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    font-size: 3rem;
                    cursor: pointer;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 2rem auto 0;
                }

                .music-play-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
                }

                .music-play-button:active {
                    transform: scale(0.95);
                }

                .back-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: white;
                    color: #c06c84;
                    text-decoration: none;
                    border-radius: 50px;
                    margin-bottom: 2rem;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .dark-mode .back-button {
                    background: rgba(45, 27, 61, 0.9);
                    color: #ff8cb3;
                    border: 1px solid rgba(255, 107, 157, 0.3);
                }

                .back-button:hover {
                    color: #ff6b9d;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease-out;
                    backdrop-filter: blur(10px);
                }

                .lightbox-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .lightbox-image {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 15px;
                    box-shadow: 0 20px 60px rgba(255, 107, 157, 0.5);
                    animation: zoomIn 0.3s ease-out;
                }

                @keyframes zoomIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .lightbox-close {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: linear-gradient(135deg, #ff6b9d, #c06c84);
                    color: white;
                    border: none;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                    z-index: 10001;
                }

                .lightbox-close:hover {
                    transform: scale(1.1) rotate(90deg);
                    box-shadow: 0 8px 30px rgba(255, 107, 157, 0.5);
                }

                .lightbox-prev,
                .lightbox-next {
                    position: fixed;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 107, 157, 0.9);
                    color: white;
                    border: none;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    font-size: 2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                    z-index: 10001;
                }

                .lightbox-prev {
                    left: 2rem;
                }

                .lightbox-next {
                    right: 2rem;
                }

                .lightbox-prev:hover,
                .lightbox-next:hover {
                    background: linear-gradient(135deg, #ff6b9d, #c06c84);
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 8px 30px rgba(255, 107, 157, 0.5);
                }

                .lightbox-counter {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 107, 157, 0.9);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 50px;
                    font-family: 'Poppins', sans-serif;
                    font-size: 1rem;
                    font-weight: 500;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                    z-index: 10001;
                }

                @media (max-width: 768px) {
                    .letter-envelope {
                        padding: 2rem 1.5rem;
                    }
                    .letter-to {
                        font-size: 2rem;
                    }
                    .letter-message {
                        font-size: 1.1rem;
                    }
                    .lightbox-prev,
                    .lightbox-next {
                        width: 45px;
                        height: 45px;
                        font-size: 1.5rem;
                    }
                    .lightbox-prev {
                        left: 1rem;
                    }
                    .lightbox-next {
                        right: 1rem;
                    }
                    .lightbox-close {
                        top: 1rem;
                        right: 1rem;
                        width: 40px;
                        height: 40px;
                        font-size: 1.2rem;
                    }
                }
            `}</style>

            <div className={`love-letter-container ${darkMode ? 'dark-mode' : ''}`}>
                {/* Music Overlay - Show before music starts */}
                {letterData?.youtubeUrl && !musicStarted && (
                    <div className="music-overlay">
                        <div className="music-overlay-content">
                            <h2 style={{ 
                                fontFamily: "'Dancing Script', cursive", 
                                fontSize: '3rem',
                                marginBottom: '1rem'
                            }}>
                                🎵 Putar Musik Romantis 🎵
                            </h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                                Klik tombol untuk memulai pengalaman romantis
                            </p>
                            <button 
                                className="music-play-button"
                                onClick={() => {
                                    setMusicStarted(true)
                                    const videoId = getYoutubeVideoId(letterData.youtubeUrl)
                                    if (videoId) {
                                        setTimeout(() => initYouTubePlayer(videoId), 500)
                                    }
                                }}
                                aria-label="Play Music"
                            >
                                <i className="bi bi-play-fill"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Floating Hearts */}
                <div className="floating-hearts">
                    {hearts.map((heart) => (
                        <div
                            key={heart.id}
                            className="heart"
                            style={{
                                left: `${heart.left}%`,
                                animationDelay: `${heart.delay}s`,
                                animationDuration: `${heart.duration}s`,
                                color: ['#ff6b9d', '#c06c84', '#f67280', '#ff8c94'][Math.floor(Math.random() * 4)],
                            }}
                        >
                            {['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)]}
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="letter-content">
                    <a href="/" className="back-button">
                        <i className="bi bi-arrow-left"></i> Kembali
                    </a>

                    <div className="letter-envelope">
                        <div className="letter-header">
                            <div className="letter-to">
                                Untuk {letterData.recipientName} 💝
                            </div>
                            <div className="letter-from">
                                Dari {letterData.senderName}
                            </div>
                        </div>

                        {letterData.youtubeUrl && musicStarted && (
                            <div className="youtube-container">
                                <div id="youtube-player"></div>
                            </div>
                        )}

                        {letterData.images && letterData.images.length > 0 && (
                            <div className="images-gallery mb-4">
                                <div className="row g-3">
                                    {letterData.images.map((imageUrl, index) => (
                                        <div key={index} className={letterData.images.length === 1 ? 'col-12' : 'col-md-6'}>
                                            <img 
                                                src={imageUrl} 
                                                alt={`Romantic ${index + 1}`} 
                                                className="letter-image"
                                                onClick={() => openLightbox(index)}
                                                style={{ cursor: 'pointer' }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="letter-message">
                            {letterData.message}
                        </div>

                        <div className="letter-signature">
                            <div className="signature-text">
                                Dengan Cinta,
                            </div>
                            <div className="signature-text">
                                {letterData.senderName} 💕
                            </div>
                        </div>
                    </div>
                </div>

                {/* Music Control (if YouTube is present and music started) */}
                {letterData.youtubeUrl && musicStarted && showMusicControl && (
                    <div 
                        className="music-control" 
                        onClick={toggleMusic}
                        title={isPlaying ? "Pause Music" : "Play Music"}
                    >
                        <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                    </div>
                )}

                {/* Image Lightbox */}
                {selectedImageIndex !== null && letterData?.images && (
                    <div className="lightbox-overlay" onClick={closeLightbox}>
                        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <button className="lightbox-close" onClick={closeLightbox}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                            
                            {letterData.images.length > 1 && (
                                <>
                                    <button className="lightbox-prev" onClick={prevImage}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                    <button className="lightbox-next" onClick={nextImage}>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </>
                            )}
                            
                            <img 
                                src={letterData.images[selectedImageIndex]} 
                                alt={`Romantic ${selectedImageIndex + 1}`}
                                className="lightbox-image"
                            />
                            
                            <div className="lightbox-counter">
                                {selectedImageIndex + 1} / {letterData.images.length}
                            </div>
                        </div>
                    </div>
                )}

                {/* Dark Mode Toggle */}
                <button 
                    className="dark-mode-toggle"
                    onClick={toggleDarkMode}
                    title={darkMode ? "Light Mode" : "Dark Mode"}
                >
                    <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
                </button>
            </div>
        </>
    )
}

export default LoveLetterView
