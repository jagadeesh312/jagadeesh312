import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './cursor.css';
import './upgrade.css';
import './advanced.css';
import './hero-card.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
