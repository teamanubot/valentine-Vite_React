import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../../css/valentine.css'

function ValentineHome() {
    const [hearts, setHearts] = useState([])
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('valentine-dark-mode') === 'true'
    })

    // Generate floating hearts animation
    useEffect(() => {
        const heartArray = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 4,
        }))
        setHearts(heartArray)

        // Countdown to next Valentine's Day
        const countdownInterval = setInterval(() => {
            const now = new Date()
            const valentineDay = new Date(now.getFullYear(), 1, 14) // Feb 14
            if (valentineDay < now) {
                valentineDay.setFullYear(valentineDay.getFullYear() + 1)
            }
            
            const diff = valentineDay - now
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)
            
            setCountdown({ days, hours, minutes, seconds })
        }, 1000)

        return () => clearInterval(countdownInterval)
    }, [])

    useEffect(() => {
        localStorage.setItem('valentine-dark-mode', darkMode)
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    const loveQuotes = [
        {
            quote: "Love is composed of a single soul inhabiting two bodies.",
            author: "Aristotle",
            icon: "bi-hearts"
        },
        {
            quote: "The best thing to hold onto in life is each other.",
            author: "Audrey Hepburn",
            icon: "bi-heart-pulse"
        },
        {
            quote: "Love recognizes no barriers. It jumps hurdles, leaps fences.",
            author: "Maya Angelou",
            icon: "bi-heart-arrow"
        }
    ]

    const loveIdeas = [
        {
            title: "Romantic Dinner",
            description: "Plan a candlelit dinner for two with your loved one's favorite dishes",
            icon: "bi-cake2",
            color: "#ff6b9d"
        },
        {
            title: "Love Letters",
            description: "Write heartfelt messages expressing your deepest feelings",
            icon: "bi-envelope-heart",
            color: "#c06c84"
        },
        {
            title: "Memory Lane",
            description: "Create a photo album of your beautiful moments together",
            icon: "bi-camera-reels",
            color: "#f67280"
        },
        {
            title: "Surprise Gifts",
            description: "Express your love with thoughtful and meaningful presents",
            icon: "bi-gift",
            color: "#ff8c94"
        },
        {
            title: "Quality Time",
            description: "Spend uninterrupted time together doing what you both love",
            icon: "bi-hourglass-split",
            color: "#ffc1cc"
        },
        {
            title: "Adventure Together",
            description: "Create new memories with an exciting adventure or trip",
            icon: "bi-airplane-engines",
            color: "#ff9aa2"
        }
    ]

    return (
        <div className={`valentine-container ${darkMode ? 'dark-mode' : ''}`}>
                {/* Floating Hearts Background */}
                <div className="floating-hearts">
                    {hearts.map((heart) => (
                        <div
                            key={heart.id}
                            className="heart"
                            style={{
                                left: `${heart.left}%`,
                                animationDelay: `${heart.delay}s`,
                                animationDuration: `${heart.duration}s`,
                            }}
                        >
                            ❤️
                        </div>
                    ))}
                </div>

                <div className="content-wrapper">
                    {/* Hero Section */}
                    <section className="hero-section">
                        <div className="container">
                            <div className="hero-content">
                                <h1>Happy Valentine's Day</h1>
                                <p className="hero-subtitle">Celebrate Love, Celebrate Life</p>
                                <p className="hero-description">
                                    Valentine's Day is a celebration of love in all its forms. Whether it's romantic love,
                                    friendship, or family bonds, today is the perfect day to show appreciation for those
                                    who make your life beautiful.
                                </p>

                                {/* Countdown */}
                                <div className="countdown-section">
                                    <h3 className="countdown-title">Next Valentine's Day</h3>
                                    <div className="countdown-timer">
                                        <div className="countdown-item">
                                            <span className="countdown-value">{countdown.days}</span>
                                            <span className="countdown-label">Days</span>
                                        </div>
                                        <div className="countdown-item">
                                            <span className="countdown-value">{countdown.hours}</span>
                                            <span className="countdown-label">Hours</span>
                                        </div>
                                        <div className="countdown-item">
                                            <span className="countdown-value">{countdown.minutes}</span>
                                            <span className="countdown-label">Minutes</span>
                                        </div>
                                        <div className="countdown-item">
                                            <span className="countdown-value">{countdown.seconds}</span>
                                            <span className="countdown-label">Seconds</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quotes Section */}
                    <section className="quotes-section">
                        <div className="container">
                            <h2 className="section-title">Love Quotes</h2>
                            <div className="row g-4">
                                {loveQuotes.map((quote, index) => (
                                    <div key={index} className="col-md-4">
                                        <div className="quote-card">
                                            <i className={`bi ${quote.icon} quote-icon`}></i>
                                            <p className="quote-text">"{quote.quote}"</p>
                                            <p className="quote-author">— {quote.author}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Valentine Ideas Section */}
                    <section className="ideas-section">
                        <div className="container">
                            <h2 className="section-title">Ways to Celebrate Love</h2>
                            <div className="row g-4">
                                {loveIdeas.map((idea, index) => (
                                    <div key={index} className="col-md-4 col-lg-4">
                                        <div 
                                            className="idea-card"
                                            onClick={() => {
                                                if (idea.title === "Love Letters") {
                                                    window.location.href = "/love-letter"
                                                }
                                            }}
                                            style={{
                                                cursor: idea.title === "Love Letters" ? "pointer" : "default"
                                            }}
                                        >
                                            <i
                                                className={`bi ${idea.icon} idea-icon`}
                                                style={{ color: idea.color }}
                                            ></i>
                                            <h3 className="idea-title">{idea.title}</h3>
                                            <p className="idea-description">{idea.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="footer">
                        <div className="container">
                            <div className="footer-heart">💝</div>
                            <p className="footer-text">Made with Love</p>
                            <p>© 2026 Valentine's Day • Spread Love Everywhere</p>
                        </div>
                    </footer>
                </div>

                {/* Dark Mode Toggle */}
                <button 
                    className="dark-mode-toggle"
                    onClick={toggleDarkMode}
                    title={darkMode ? "Light Mode" : "Dark Mode"}
                >
                    <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
                </button>
            </div>
    )
}

export default ValentineHome