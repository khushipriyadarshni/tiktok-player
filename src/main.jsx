import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { seedDatabase } from './db/seed.js'
import './styles/globals.css'
import './styles/animations.css'
import './styles/utilities.css'

// Seed the database on first load (no-ops if already seeded)
seedDatabase().catch(console.error)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
