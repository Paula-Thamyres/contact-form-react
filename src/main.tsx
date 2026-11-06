import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { contactUseCases, themeGateway } from './compositionRoot';
import './index.css';
import { App } from './presentation/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento raiz não encontrado no index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App useCases={contactUseCases} themeGateway={themeGateway} />
  </StrictMode>,
);
