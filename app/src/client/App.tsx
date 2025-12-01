import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { routes } from 'wasp/client/router';
import { MantineProvider, createTheme } from '@mantine/core';
import './Main.css';
import { Shell } from './components/Shell';
import CookieConsentBanner from './components/cookie-consent/Banner';

const theme = createTheme({
  /** Put your mantine theme override here */
});

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <MantineProvider theme={theme}>
      <Shell>
        {/* If we want to render specific route content inside the Shell, we can use Outlet here.
            However, the Shell currently manages its own views (Dashboard, Workouts, etc.).
            If the user wants the Shell to wrap *everything*, we might need to adjust.
            For now, I'll render Outlet inside Shell if needed, or just let Shell be the layout.
            Given the Shell has its own tabs, maybe we don't need Outlet for the main views?
            But for /pricing, we navigate away.
            Let's keep Outlet here so other routes work if they are nested.
         */}
        {/* <Outlet />  -- The Shell has its own content switching. 
             If we are on a route that ISN'T handled by the Shell tabs (like /login?), 
             we might need logic. But the user said "Shell should be the full app".
             Let's assume Shell is the main layout.
          */}
      </Shell>
      <CookieConsentBanner />
    </MantineProvider>
  );
}
