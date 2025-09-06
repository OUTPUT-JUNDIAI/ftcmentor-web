'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Search,
  MessageSquare,
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigation = {
  team: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Buscar Mentores', href: '/mentors', icon: Search },
    { name: 'Minhas Conexões', href: '/matches', icon: MessageSquare },
    { name: 'Sessões', href: '/sessions', icon: Calendar },
    { name: 'Perfil', href: '/profile', icon: Settings },
  ],
  mentor: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Solicitações', href: '/requests', icon: MessageSquare },
    { name: 'Minhas Equipes', href: '/teams', icon: Users },
    { name: 'Sessões', href: '/sessions', icon: Calendar },
    { name: 'Perfil', href: '/profile', icon: Settings },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Métricas', href: '/admin/metrics', icon: BarChart3 },
    { name: 'Mentores', href: '/admin/mentors', icon: Users },
    { name: 'Denúncias', href: '/admin/reports', icon: Shield },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ],
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const userRole = useUserRole();

  const navItems = navigation[userRole || 'team'] || navigation.team;

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-brand-primary"></div>
            <span className="font-bold text-lg text-gray-900">FIRST® Tech Challenge Mentors</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-brand-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  collapsed ? 'mr-0' : 'mr-3',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* User role indicator */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {userRole === 'team' && 'Equipe'}
            {userRole === 'mentor' && 'Mentor'}
            {userRole === 'admin' && 'Administrador'}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-40 bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-25"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto">
              {sidebarContent}
            </div>
          </>
        )}
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-200',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          className
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}