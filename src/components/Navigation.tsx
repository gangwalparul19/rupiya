'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { logout } from '@/lib/authService';
import PWAInstallButton from './PWAInstallButton';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const userProfile = useAppStore((state) => state.userProfile);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isLoading = useAppStore((state) => state.isLoading);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render navigation if not authenticated or still loading
  if (!isMounted || isLoading || !isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      label: 'Tracking',
      icon: '💸',
      submenu: [
        { href: '/expenses', label: 'Expenses', icon: '💰' },
        { href: '/income', label: 'Income', icon: '📊' },
        { href: '/recurring', label: 'Recurring', icon: '🔄' },
      ],
    },
    {
      label: 'Planning',
      icon: '📋',
      submenu: [
        { href: '/budgets', label: 'Budgets', icon: '📋' },
        { href: '/goals', label: 'Goals', icon: '🎯' },
      ],
    },
    {
      label: 'Investments',
      icon: '📈',
      submenu: [
        { href: '/investments', label: 'Portfolio', icon: '📈' },
        { href: '/reports', label: 'Reports', icon: '📑' },
      ],
    },
    {
      label: 'Assets',
      icon: '🏠',
      submenu: [
        { href: '/houses', label: 'Houses', icon: '🏠' },
        { href: '/vehicles', label: 'Vehicles', icon: '🚗' },
      ],
    },
    {
      label: 'Storage',
      icon: '📁',
      submenu: [
        { href: '/notes', label: 'Notes', icon: '📝' },
        { href: '/documents', label: 'Documents', icon: '📄' },
        { href: '/calendar', label: 'Calendar', icon: '📅' },
      ],
    },
    {
      label: 'Advanced',
      icon: '✨',
      submenu: [
        { href: '/house-help', label: 'House Help', icon: '🧹' },
        { href: '/splitting', label: 'Splitting', icon: '💸' },
        { href: '/receipts', label: 'Receipts', icon: '📸' },
        { href: '/categories', label: 'Categories', icon: '📂' },
        { href: '/analytics', label: 'Analytics', icon: '📊' },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[120] transition-all duration-300">
        <div className="container-responsive flex justify-between items-center h-16 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Rupiya Logo"
              width={48}
              height={48}
              sizes="(max-width: 640px) 48px, (max-width: 1024px) 56px, 64px"
              className="h-10 w-auto sm:h-12 md:h-14 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {navItems.map((item) => {
              if ('submenu' in item && item.submenu) {
                return (
                  <div key={item.label} className="group relative">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 font-bold text-sm lg:text-base group-hover:scale-105" aria-label={`Toggle ${item.label} menu`}>
                      <span className="text-xl">{item.icon}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                      <span className="text-[10px] ml-1 opacity-40 transition-transform group-hover:rotate-180">▼</span>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-60 bg-slate-950/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-white/10 p-2.5 origin-top scale-95 group-hover:scale-100">
                      <div className="space-y-1.5">
                        {item.submenu.map((subitem: any) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className={`flex items-center gap-3 px-5 py-3.5 text-sm font-bold transition-all duration-200 rounded-2xl ${isActive(subitem.href)
                              ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                              : 'text-slate-400 hover:text-white hover:bg-white/10'
                              }`}
                          >
                            <span className="text-xl">{subitem.icon}</span>
                            <span className="flex-1">{subitem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </nav>

          {/* Right Side - Profile, Install Button & Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* PWA Install Button */}
            <PWAInstallButton />

            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 font-bold text-sm bg-white/5 border border-white/5"
              >
                <span>👤</span>
                <span className="hidden md:inline">{userProfile?.displayName || user?.email?.split('@')[0]}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-slate-950/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] z-50 border border-white/10 p-2.5 overflow-hidden animate-slide-up">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200 text-sm font-bold"
                  >
                    <span className="text-xl">👤</span> Profile
                  </Link>
                  <Link
                    href="/payment-methods"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200 text-sm font-bold"
                  >
                    <span className="text-xl">💳</span> Payment Methods
                  </Link>
                  <div className="h-px bg-white/5 my-2 mx-2"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all duration-200 text-sm font-bold"
                  >
                    <span className="text-xl">🚪</span> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 active:scale-90"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block h-[3px] w-6 bg-white transform transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
                <span className={`absolute block h-[3px] w-6 bg-white transform transition-all duration-300 ease-in-out top-3 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute block h-[3px] w-6 bg-white transform transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Moved outside header for better z-index behavior */}
      {isOpen && (
        <nav className="md:hidden bg-slate-950/98 backdrop-blur-3xl animate-fade-in fixed inset-0 top-0 pt-24 z-[110] overflow-y-auto">
          <div className="p-4 space-y-3">
            {navItems.map((item) => {
              if ('submenu' in item && item.submenu) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-base ${expandedMenu === item.label ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[10px] opacity-40 transition-transform duration-300 ${expandedMenu === item.label ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>

                    {expandedMenu === item.label && (
                      <div className="grid grid-cols-1 gap-2 pl-2 pr-2 py-2 animate-slide-up">
                        {item.submenu.map((subitem: any) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={() => {
                              setIsOpen(false);
                              setExpandedMenu(null);
                            }}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${isActive(subitem.href)
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-white/5 text-slate-200 hover:text-white hover:bg-white/10'
                              }`}
                          >
                            <span className="text-xl">{subitem.icon}</span>
                            <span className="text-sm font-bold">{subitem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}

            {/* Mobile Profile & Logout Section */}
            <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/5 text-slate-200 font-bold hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                <span className="text-2xl">👤</span>
                <span className="text-base">Profile</span>
              </Link>
              <Link
                href="/payment-methods"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/5 text-slate-200 font-bold hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                <span className="text-2xl">💳</span>
                <span className="text-base">Payment Methods</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <span className="text-2xl">🚪</span>
                <span className="text-base">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
