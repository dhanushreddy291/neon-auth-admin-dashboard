import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react/ui';
import App from './App.tsx';
import { authClient } from './auth.ts';
import './index.css';
import { ImpersonationBanner } from './components/ImpersonationBanner.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NeonAuthUIProvider authClient={authClient} emailOTP social={{ providers: ['google'] }}>
      <BrowserRouter>
        <ImpersonationBanner />
        <App />
      </BrowserRouter>
    </NeonAuthUIProvider>
  </StrictMode>
);