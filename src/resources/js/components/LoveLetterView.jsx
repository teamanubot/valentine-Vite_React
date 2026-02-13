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
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
    const [imageAspectRatios, setImageAspectRatios] = useState({})
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('valentine-dark-mode') === 'true'
    })
    const playerRef = React.useRef(null)
    const carouselIntervalRef = React.useRef(null)

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

    // Auto-rotate carousel images
    useEffect(() => {
        if (letterData?.images && letterData.images.length > 1) {
            carouselIntervalRef.current = setInterval(() => {
                setCurrentCarouselIndex((prevIndex) => 
                    (prevIndex + 1) % letterData.images.length
                )
            }, 4000) // Change image every 4 seconds

            return () => {
                if (carouselIntervalRef.current) {
                    clearInterval(carouselIntervalRef.current)
                }
            }
        }
    }, [letterData?.images])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    const nextCarouselImage = () => {
        if (letterData?.images && letterData.images.length > 0) {
            setCurrentCarouselIndex((prevIndex) => 
                (prevIndex + 1) % letterData.images.length
            )
            // Reset auto-rotate timer
            if (carouselIntervalRef.current) {
                clearInterval(carouselIntervalRef.current)
                carouselIntervalRef.current = setInterval(() => {
                    setCurrentCarouselIndex((prevIndex) => 
                        (prevIndex + 1) % letterData.images.length
                    )
                }, 4000)
            }
        }
    }

    const handleImageLoad = (e, index) => {
        const img = e.target
        const aspectRatio = img.naturalWidth / img.naturalHeight
        setImageAspectRatios(prev => ({
            ...prev,
            [index]: aspectRatio
        }))
    }

    const getCarouselHeight = () => {
        const currentAspectRatio = imageAspectRatios[currentCarouselIndex]
        if (!currentAspectRatio) return 'auto'
        
        // Calculate height based on aspect ratio
        // Using max-width of carousel (typically viewport width - padding)
        if (currentAspectRatio >= 2.5) {
            // Ultra wide (21:9, 19:6, etc.)
            return '40vh'
        } else if (currentAspectRatio >= 1.7) {
            // Wide landscape (16:9, 18:9, etc.)
            return '50vh'
        } else if (currentAspectRatio >= 1.3) {
            // Standard landscape (4:3, 3:2, etc.)
            return '60vh'
        } else if (currentAspectRatio >= 0.9 && currentAspectRatio <= 1.1) {
            // Square (1:1)
            return '70vh'
        } else if (currentAspectRatio >= 0.6) {
            // Portrait (3:4, 2:3, etc.)
            return '80vh'
        } else {
            // Ultra portrait (9:16, etc.)
            return '90vh'
        }
    }

    const getAspectRatioLabel = () => {
        const currentAspectRatio = imageAspectRatios[currentCarouselIndex]
        if (!currentAspectRatio) return ''
        
        // Common aspect ratios
        if (Math.abs(currentAspectRatio - 16/9) < 0.1) return '16:9'
        if (Math.abs(currentAspectRatio - 21/9) < 0.1) return '21:9'
        if (Math.abs(currentAspectRatio - 4/3) < 0.1) return '4:3'
        if (Math.abs(currentAspectRatio - 3/2) < 0.1) return '3:2'
        if (Math.abs(currentAspectRatio - 1) < 0.1) return '1:1'
        if (Math.abs(currentAspectRatio - 3/4) < 0.1) return '3:4'
        if (Math.abs(currentAspectRatio - 9/16) < 0.1) return '9:16'
        
        // Return calculated ratio
        return `${currentAspectRatio.toFixed(2)}:1`
    }

    const prevCarouselImage = () => {
        if (letterData?.images && letterData.images.length > 0) {
            setCurrentCarouselIndex((prevIndex) => 
                prevIndex === 0 ? letterData.images.length - 1 : prevIndex - 1
            )
            // Reset auto-rotate timer
            if (carouselIntervalRef.current) {
                clearInterval(carouselIntervalRef.current)
                carouselIntervalRef.current = setInterval(() => {
                    setCurrentCarouselIndex((prevIndex) => 
                        (prevIndex + 1) % letterData.images.length
                    )
                }, 4000)
            }
        }
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

                /* Carousel Styles */
                .carousel-container {
                    position: relative;
                    width: 100%;
                    margin: 2rem 0;
                    padding: 2rem;
                    background: linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(255, 240, 245, 0.2) 100%);
                    border-radius: 25px;
                }

                .dark-mode .carousel-container {
                    background: linear-gradient(135deg, rgba(255, 107, 157, 0.05) 0%, rgba(192, 108, 132, 0.1) 100%);
                }

                .carousel-wrapper {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 20px;
                    border: 4px solid transparent;
                    background: 
                        linear-gradient(white, white) padding-box,
                        linear-gradient(
                            45deg,
                            #ff6b9d 0%,
                            #ffa5c0 25%,
                            #ffb8d1 50%,
                            #ffa5c0 75%,
                            #ff6b9d 100%
                        ) border-box;
                    box-shadow: 
                        0 8px 32px rgba(255, 107, 157, 0.2),
                        0 0 0 8px rgba(255, 182, 193, 0.1),
                        0 0 0 16px rgba(255, 192, 203, 0.05),
                        inset 0 2px 8px rgba(255, 255, 255, 0.5);
                    animation: borderGlow 3s ease-in-out infinite;
                    transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .dark-mode .carousel-wrapper {
                    background: 
                        linear-gradient(rgba(45, 27, 61, 0.9), rgba(45, 27, 61, 0.9)) padding-box,
                        linear-gradient(
                            45deg,
                            #ff6b9d 0%,
                            #ff8cb3 25%,
                            #ffa5c0 50%,
                            #ff8cb3 75%,
                            #ff6b9d 100%
                        ) border-box;
                    box-shadow: 
                        0 8px 32px rgba(255, 107, 157, 0.4),
                        0 0 0 8px rgba(255, 107, 157, 0.15),
                        0 0 0 16px rgba(255, 107, 157, 0.08),
                        inset 0 2px 8px rgba(255, 107, 157, 0.2);
                }

                @keyframes borderGlow {
                    0%, 100% {
                        filter: brightness(1) drop-shadow(0 0 10px rgba(255, 107, 157, 0.3));
                    }
                    50% {
                        filter: brightness(1.1) drop-shadow(0 0 20px rgba(255, 107, 157, 0.5));
                    }
                }

                .carousel-track {
                    display: flex;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    height: 100%;
                }

                .carousel-slide {
                    min-width: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }

                .carousel-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                    cursor: pointer;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }

                .carousel-image:hover {
                    transform: scale(1.02);
                }

                .carousel-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: linear-gradient(135deg, rgba(255, 107, 157, 0.95), rgba(192, 108, 132, 0.95));
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
                    box-shadow: 
                        0 5px 20px rgba(255, 107, 157, 0.4),
                        0 0 0 3px rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                    z-index: 10;
                    backdrop-filter: blur(10px);
                }

                .carousel-nav:hover {
                    transform: translateY(-50%) scale(1.15);
                    box-shadow: 
                        0 8px 30px rgba(255, 107, 157, 0.6),
                        0 0 0 4px rgba(255, 255, 255, 0.5);
                    background: linear-gradient(135deg, #ff6b9d, #d98ba6);
                }

                .carousel-nav:active {
                    transform: translateY(-50%) scale(0.95);
                }

                .carousel-nav-prev {
                    left: 1rem;
                }

                .carousel-nav-next {
                    right: 1rem;
                }

                .carousel-indicators {
                    display: flex;
                    justify-content: center;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                    padding: 1rem;
                }

                .carousel-indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(192, 108, 132, 0.3);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    position: relative;
                }

                .carousel-indicator::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: #ff6b9d;
                    transition: all 0.3s ease;
                }

                .carousel-indicator.active {
                    background: linear-gradient(135deg, #ff6b9d, #c06c84);
                    transform: scale(1.3);
                    box-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
                }

                .carousel-indicator.active::before {
                    width: 20px;
                    height: 20px;
                    opacity: 0.3;
                }

                .carousel-indicator:hover:not(.active) {
                    background: rgba(192, 108, 132, 0.6);
                    transform: scale(1.15);
                }

                .dark-mode .carousel-indicator {
                    background: rgba(255, 107, 157, 0.2);
                }

                .dark-mode .carousel-indicator.active {
                    background: linear-gradient(135deg, #ff8cb3, #d98ba6);
                    box-shadow: 0 0 15px rgba(255, 107, 157, 0.7);
                }

                .carousel-counter {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: linear-gradient(135deg, rgba(255, 107, 157, 0.95), rgba(192, 108, 132, 0.95));
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    font-family: 'Poppins', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
                    backdrop-filter: blur(10px);
                    z-index: 5;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                }

                .carousel-aspect-label {
                    font-size: 0.7rem;
                    opacity: 0.8;
                    font-weight: 400;
                }

                .dark-mode .carousel-counter {
                    background: linear-gradient(135deg, rgba(255, 107, 157, 0.9), rgba(217, 139, 166, 0.9));
                    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.6);
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
                    .carousel-container {
                        padding: 1rem;
                    }
                    .carousel-wrapper {
                        min-height: 300px;
                    }
                    .carousel-nav {
                        width: 40px;
                        height: 40px;
                        font-size: 1.2rem;
                    }
                    .carousel-nav-prev {
                        left: 0.5rem;
                    }
                    .carousel-nav-next {
                        right: 0.5rem;
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
                            <div className="carousel-container">
                                <div 
                                    className="carousel-wrapper"
                                    style={{
                                        height: getCarouselHeight(),
                                        minHeight: '300px',
                                        maxHeight: '90vh'
                                    }}
                                >
                                    <div 
                                        className="carousel-track"
                                        style={{
                                            transform: `translateX(-${currentCarouselIndex * 100}%)`
                                        }}
                                    >
                                        {letterData.images.map((imageUrl, index) => (
                                            <div key={index} className="carousel-slide">
                                                <img 
                                                    src={imageUrl} 
                                                    alt={`Romantic ${index + 1}`} 
                                                    className="carousel-image"
                                                    onClick={() => openLightbox(index)}
                                                    onLoad={(e) => handleImageLoad(e, index)}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {letterData.images.length > 1 && (
                                        <>
                                            <button 
                                                className="carousel-nav carousel-nav-prev"
                                                onClick={prevCarouselImage}
                                                aria-label="Previous Image"
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                            <button 
                                                className="carousel-nav carousel-nav-next"
                                                onClick={nextCarouselImage}
                                                aria-label="Next Image"
                                            >
                                                <i className="bi bi-chevron-right"></i>
                                            </button>

                                            <div className="carousel-counter">
                                                <div>{currentCarouselIndex + 1} / {letterData.images.length}</div>
                                                {imageAspectRatios[currentCarouselIndex] && (
                                                    <div className="carousel-aspect-label">
                                                        {getAspectRatioLabel()}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {letterData.images.length > 1 && (
                                    <div className="carousel-indicators">
                                        {letterData.images.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`carousel-indicator ${index === currentCarouselIndex ? 'active' : ''}`}
                                                onClick={() => {
                                                    setCurrentCarouselIndex(index)
                                                    // Reset auto-rotate timer
                                                    if (carouselIntervalRef.current) {
                                                        clearInterval(carouselIntervalRef.current)
                                                        carouselIntervalRef.current = setInterval(() => {
                                                            setCurrentCarouselIndex((prevIndex) => 
                                                                (prevIndex + 1) % letterData.images.length
                                                            )
                                                        }, 4000)
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
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
                {(!letterData?.youtubeUrl || musicStarted) && (
                    <button 
                        className="dark-mode-toggle"
                        onClick={toggleDarkMode}
                        title={darkMode ? "Light Mode" : "Dark Mode"}
                    >
                        <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
                    </button>
                )}
            </div>
        </>
    )
}

export default LoveLetterView
