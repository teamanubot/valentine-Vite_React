import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom/client'
import LoveLetterView from './components/LoveLetterView'

const rootElement = document.getElementById('root')
const recipientName = rootElement?.dataset.recipient || ''

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <LoveLetterView recipientName={recipientName} />
        </React.StrictMode>
    )
}
