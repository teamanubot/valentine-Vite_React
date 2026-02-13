import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom/client'
import LoveLetterCreate from './components/LoveLetterCreate'

const rootElement = document.getElementById('root')
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <LoveLetterCreate />
        </React.StrictMode>
    )
}
