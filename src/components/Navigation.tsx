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
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center h-14 sm:h-16 md:h-20">
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
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if ('submenu' in item && item.submenu) {
                return (
                  <div key={item.label} className="group relative">
                    <button className="flex items-center gap-1 px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition font-medium text-sm">
                      <span className="text-base">{item.icon}</span>
                      <span className="hidden lg:inline text-sm">{item.label}</span>
                      <span className="text-xs ml-1">▼</span>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-0 w-44 bg-slate-700 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-slate-600">
                      <div className="py-1">
                        {item.submenu.map((subitem: any, idx) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className={`flex items-center gap-2 px-3 py-2 text-xs transition ${
                              isActive(subitem.href)
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-300 hover:text-white hover:bg-slate-600'
                            } ${idx === 0 ? 'rounded-t-md' : ''} ${idx === item.submenu.length - 1 ? 'rounded-b-md' : ''}`}
                          >
                            <span className="text-sm">{subitem.icon}</span>
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton />

            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition text-xs sm:text-sm"
              >
                <span>👤</span>
                <span className="hidden md:inline text-xs">{userProfile?.displayName || user?.email?.split('@')[0]}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-700 rounded-md shadow-lg z-50">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-3 py-2 text-white hover:bg-slate-600 rounded-t-md border-b border-slate-600 text-xs"
                  >
                    👤 Profile
                  </Link>
                  <Link
                    href="/payment-methods"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-3 py-2 text-white hover:bg-slate-600 border-b border-slate-600 text-xs"
                  >
                    💳 Payment
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-600 rounded-b-md text-xs"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2 hover:bg-slate-700 rounded-md transition"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden bg-slate-700 border-t border-slate-600">
            <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 space-y-1">
              {navItems.map((item) => {
                if ('submenu' in item && item.submenu) {
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-600 transition font-medium text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <span className={`text-xs transition transform ${expandedMenu === item.label ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {expandedMenu === item.label && (
                        <div className="bg-slate-600 rounded-md mx-2 my-1 overflow-hidden border border-slate-500">
                          {item.submenu.map((subitem: any) => (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              onClick={() => {
                                setIsOpen(false);
                                setExpandedMenu(null);
                              }}
                              className={`flex items-center gap-2 px-4 py-2 text-xs transition ${
                                isActive(subitem.href)
                                  ? 'bg-blue-600 text-white'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-500'
                              }`}
                            >
                              <span className="text-base">{subitem.icon}</span>
                              <span>{subitem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
