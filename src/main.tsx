import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { routerBasename } from './utils/publicUrl'

import './style/fonts'
import './style/index.scss' // also includes style/settings/settings.scss

const container = document.getElementById('root') as HTMLElement

const app = (
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter basename={routerBasename}>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)

// Built pages already contain the page's HTML (see scripts/prerender.js): React just
// "hydrates" it, attaching clicks and animations. In `npm start` the page starts empty.
if (container.firstElementChild) {
    ReactDOM.hydrateRoot(container, app)
} else {
    ReactDOM.createRoot(container).render(app)
}
