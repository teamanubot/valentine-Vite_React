import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function LoveLetterCreate() {
    const [formData, setFormData] = useState({
        recipientName: '',
        senderName: '',
        message: '',
        youtubeUrl: '',
    })
    const [images, setImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('valentine-dark-mode') === 'true'
    })

    useEffect(() => {
        localStorage.setItem('valentine-dark-mode', darkMode)
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setImages(files)

        // Create previews
        const previews = files.map(file => URL.createObjectURL(file))
        setImagePreviews(previews)
    }

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = imagePreviews.filter((_, i) => i !== index)
        setImages(newImages)
        setImagePreviews(newPreviews)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!formData.recipientName) {
            alert('Nama penerima harus diisi!')
            return
        }

        if (!formData.senderName) {
            alert('Nama pengirim harus diisi!')
            return
        }

        if (!formData.message) {
            alert('Pesan cinta harus diisi!')
            return
        }

        setIsSubmitting(true)

        // Create FormData for file upload
        const submitData = new FormData()
        submitData.append('recipientName', formData.recipientName)
        submitData.append('senderName', formData.senderName)
        submitData.append('message', formData.message)
        if (formData.youtubeUrl) {
            submitData.append('youtubeUrl', formData.youtubeUrl)
        }

        // Append all images
        images.forEach((image, index) => {
            submitData.append(`images[${index}]`, image)
        })

        // Get CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

        // Submit to API
        fetch('/api/love-letter', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken || '',
                'Accept': 'application/json',
            },
            body: submitData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Love Letter berhasil dibuat! 💝')
                window.location.href = `/love-letter/${data.recipient}`
            } else {
                alert('Gagal membuat love letter. Silakan coba lagi.')
                setIsSubmitting(false)
            }
        })
        .catch(error => {
            console.error('Error:', error)
            alert('Terjadi kesalahan. Silakan coba lagi.')
            setIsSubmitting(false)
        })
    }

    return (
        <div className={`love-letter-create-page ${darkMode ? 'dark-mode' : ''}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

                body {
                    font-family: 'Poppins', sans-serif;
                }

                .love-letter-create-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #ffeef8 0%, #fff5f7 50%, #ffe8f0 100%);
                    padding: 3rem 0;
                }

                .love-letter-create-page.dark-mode {
                    background: linear-gradient(135deg, #1a0a1e 0%, #2d1b3d 50%, #3d1e3f 100%);
                }

                .letter-form-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    padding: 3rem;
                    box-shadow: 0 20px 60px rgba(255, 107, 157, 0.15);
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

                .dark-mode .letter-form-container {
                    background: rgba(45, 27, 61, 0.9);
                    border: 1px solid rgba(255, 107, 157, 0.3);
                    box-shadow: 0 30px 80px rgba(255, 107, 157, 0.3);
                }

                .letter-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem;
                    background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .dark-mode .letter-title {
                    background: linear-gradient(135deg, #ff8cb3 0%, #d98ba6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .form-label {
                    font-weight: 600;
                    color: #c06c84;
                    margin-bottom: 0.5rem;
                }

                .dark-mode .form-label {
                    color: #ff8cb3;
                }

                .form-control, .form-select {
                    border: 2px solid #ffe8f0;
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    transition: all 0.3s ease;
                }

                .dark-mode .form-control, .dark-mode .form-select {
                    background: rgba(26, 10, 30, 0.6);
                    border-color: rgba(255, 107, 157, 0.3);
                    color: #d1b3c4;
                }

                .dark-mode .form-control::placeholder {
                    color: rgba(209, 179, 196, 0.5);
                }

                .form-control:focus, .form-select:focus {
                    border-color: #ff6b9d;
                    box-shadow: 0 0 0 0.2rem rgba(255, 107, 157, 0.15);
                }

                textarea.form-control {
                    min-height: 150px;
                    resize: vertical;
                }

                .image-preview {
                    margin-top: 1rem;
                    border-radius: 15px;
                    overflow: hidden;
                    max-height: 300px;
                }

                .image-preview img {
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                }

                .image-previews {
                    margin-top: 1rem;
                }

                .preview-item {
                    position: relative;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                .preview-item img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }

                .btn-remove-image {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: rgba(255, 0, 0, 0.8);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-remove-image:hover {
                    background: rgba(255, 0, 0, 1);
                    transform: scale(1.1);
                }

                .btn-create {
                    background: linear-gradient(135deg, #ff6b9d, #c06c84);
                    border: none;
                    color: white;
                    padding: 1rem 3rem;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
                }

                .btn-create:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(255, 107, 157, 0.4);
                }

                .btn-back {
                    color: #c06c84;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .btn-back:hover {
                    color: #ff6b9d;
                    transform: translateX(-5px);
                }

                .info-text {
                    font-size: 0.85rem;
                    color: #999;
                    margin-top: 0.25rem;
                }

                .heart-icon {
                    color: #ff6b9d;
                    margin-right: 0.5rem;
                }
            `}</style>

            <div className="container">
                <a href="/" className="btn-back">
                    <i className="bi bi-arrow-left"></i> Kembali ke Home
                </a>

                <div className="letter-form-container">
                    <h1 className="letter-title">
                        <i className="bi bi-envelope-heart heart-icon"></i>
                        Create Love Letter
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">
                                <i className="bi bi-heart-fill heart-icon"></i>
                                Untuk Siapa? *
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="recipientName"
                                value={formData.recipientName}
                                onChange={handleChange}
                                placeholder="Masukkan nama penerima (contoh: Zahwa)"
                                required
                            />
                            <div className="info-text">Nama ini akan menjadi bagian dari URL love letter</div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                <i className="bi bi-person-heart heart-icon"></i>
                                Dari Siapa? *
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="senderName"
                                value={formData.senderName}
                                onChange={handleChange}
                                placeholder="Masukkan nama Anda"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                <i className="bi bi-chat-heart heart-icon"></i>
                                Pesan Cinta *
                            </label>
                            <textarea
                                className="form-control"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tuliskan pesan cinta Anda di sini..."
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                <i className="bi bi-image heart-icon"></i>
                                Upload Gambar Romantis
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                            <div className="info-text">Opsional - Upload satu atau lebih foto romantis (max 5MB per foto)</div>
                            
                            {imagePreviews.length > 0 && (
                                <div className="image-previews mt-3">
                                    <div className="row g-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="col-md-4 col-6">
                                                <div className="preview-item">
                                                    <img src={preview} alt={`Preview ${index + 1}`} className="img-fluid rounded" />
                                                    <button
                                                        type="button"
                                                        className="btn-remove-image"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <i className="bi bi-x"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                <i className="bi bi-music-note-beamed heart-icon"></i>
                                URL YouTube (Musik Romantis)
                            </label>
                            <input
                                type="url"
                                className="form-control"
                                name="youtubeUrl"
                                value={formData.youtubeUrl}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/watch?v=xxxxx"
                            />
                            <div className="info-text">Opsional - Link YouTube untuk musik latar belakang yang romantis</div>
                        </div>

                        <div className="text-center mt-5">
                            <button type="submit" className="btn btn-create" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-heart-fill me-2"></i>
                                        Buat Love Letter
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
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

export default LoveLetterCreate
