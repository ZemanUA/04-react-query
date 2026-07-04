import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
