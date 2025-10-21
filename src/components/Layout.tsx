import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from './NavBar';
import { useThemeStore } from '../store/themeStore';

const Layout = () => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;