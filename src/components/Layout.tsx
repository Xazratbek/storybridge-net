
import React from 'react';
import Navbar from './Navbar';
import { useSettings } from '@/contexts/SettingsContext';

type LayoutProps = {
  children: React.ReactNode;
  fullWidth?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  const { settings } = useSettings();
  
  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-slate-900' : 'bg-memory-paper'}`}>
      <Navbar />
      <main className={fullWidth ? 'w-full' : 'container max-w-7xl mx-auto px-4 py-8'}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
