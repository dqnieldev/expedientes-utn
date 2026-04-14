import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./services/axiosConfig"; // Configuración global de Axios (interceptores, baseURL, etc.)
import './index.css'
import './i18n'; // Configuración de i18n (internacionalización)
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
