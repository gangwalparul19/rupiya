'use client';

import { useEffect, useState } from 'react';

export default function PWAInstallButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if install prompt is ready
    const checkInstallPrompt = () => {
      setIsInstallable((window as any).isInstallPromptReady || false);
    };

    // Check immediately
    checkInstallPrompt();

    // Check periodically
    const interval = setInterval(checkInstallPrompt, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInstall = async () => {
    if ((window as any).installPWA) {
      await (window as any).installPWA();
    }
  };

  if (isInstalled) {
    return null; // Don't show button if already installed
  }

  if (!isInstallable) {
    return null; // Don't show button if not installable
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition font-semibold text-xs sm:text-sm whitespace-nowrap"
      title="Install Rupiya as an app"
    >
      <span>📱</span>
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">Install</span>
    </button>
  );
}
