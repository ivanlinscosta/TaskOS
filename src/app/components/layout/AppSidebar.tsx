import { Link, useLocation } from 'react-router';
import { useAppStore } from '../../../stores/useAppStore';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  LayoutList,
  Sparkles,
  Building2,
  UserCheck,
  MessageSquare,
  Video,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  context?: 'fiap' | 'itau';
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  
  // FIAP Section
  { title: 'Alunos', href: '/fiap/students', icon: GraduationCap, context: 'fiap' },
  { title: 'Aulas', href: '/fiap/lessons', icon: BookOpen, context: 'fiap' },
  { title: 'Cronograma', href: '/fiap/schedule', icon: Calendar, context: 'fiap' },
  { title: 'Kanban FIAP', href: '/fiap/kanban', icon: LayoutList, context: 'fiap' },
  { title: 'IA FIAP', href: '/fiap/ai', icon: Sparkles, context: 'fiap' },
  
  // Itaú Section
  { title: 'Analistas', href: '/itau/analysts', icon: Users, context: 'itau' },
  { title: 'Feedbacks', href: '/itau/feedbacks', icon: MessageSquare, context: 'itau' },
  { title: 'Reuniões', href: '/itau/meetings', icon: Video, context: 'itau' },
  { title: 'Kanban Itaú', href: '/itau/kanban', icon: LayoutList, context: 'itau' },
  { title: 'Materiais', href: '/itau/materials', icon: FolderOpen, context: 'itau' },
  { title: 'IA Itaú', href: '/itau/ai', icon: Sparkles, context: 'itau' },
];

export default function AppSidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, contextMode } = useAppStore();

  const fiapItems = navItems.filter((item) => !item.context || item.context === 'fiap');
  const itauItems = navItems.filter((item) => item.context === 'itau');

  return (
    <aside
      className={cn(
        'bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">D</span>
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">DualOS</h1>
              <p className="text-xs text-muted-foreground">Personal OS</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Dashboard */}
        <div>
          {navItems
            .filter((item) => !item.context)
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                    sidebarCollapsed && 'justify-center'
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
        </div>

        <Separator />

        {/* FIAP Section */}
        <div>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-3 mb-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                FIAP
              </span>
            </div>
          )}
          {fiapItems
            .filter((item) => item.context === 'fiap')
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                    sidebarCollapsed && 'justify-center'
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm">{item.title}</span>}
                </Link>
              );
            })}
        </div>

        <Separator />

        {/* Itaú Section */}
        <div>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-3 mb-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Itaú
              </span>
            </div>
          )}
          {itauItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                  sidebarCollapsed && 'justify-center'
                )}
                title={sidebarCollapsed ? item.title : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm">{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground text-center">
            v1.0.0 • 2026
          </div>
        </div>
      )}
    </aside>
  );
}
