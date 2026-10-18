import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { API_URL } from './config';

fetch(`${API_URL}/api/visites`, {
    method: 'POST'
}).catch(() => {
    console.warn('Impossible de compter cette visite');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
