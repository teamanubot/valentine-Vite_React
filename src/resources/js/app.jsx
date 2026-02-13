import './bootstrap'

import React from 'react'
import ReactDOM from 'react-dom/client'
import ValentineHome from './components/ValentineHome'

const rootElement = document.getElementById('root')
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <ValentineHome />
        </React.StrictMode>
    )
}
