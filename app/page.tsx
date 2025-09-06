'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResponsiveHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-brand-primary"></div>
            <span className="font-bold text-base sm:text-xl text-gray-900 whitespace-nowrap">
              FTC Mentor Platform
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Começar</Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="sm:hidden mt-2 space-y-2 pb-4">
            <Link href="/auth/login" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Entrar</Button>
            </Link>
            <Link href="/auth/register" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-start">Começar</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
