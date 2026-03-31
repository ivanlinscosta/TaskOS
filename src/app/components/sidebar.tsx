import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Building2, 
  Sparkles,
  BookOpen,
  Users,
  Calendar,
  Kanban,
  UserCircle,
  MessageSquare,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useState } from 'react';
import { useTheme } from '../../lib/theme-context';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  context?: 'fiap' | 'itau';
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'FIAP', icon: GraduationCap, path: '/fiap', context: 'fiap' },
  { label: 'Aulas', icon: BookOpen, path: '/fiap/aulas', context: 'fiap' },
  { label: 'Alunos', icon: Users, path: '/fiap/alunos', context: 'fiap' },
  { label: 'Cronograma', icon: Calendar, path: '/fiap/cronograma', context: 'fiap' },
  { label: 'Kanban FIAP', icon: Kanban, path: '/fiap/kanban', context: 'fiap' },
  { label: 'Itaú', icon: Building2, path: '/itau', context: 'itau' },
  { label: 'Analistas', icon: UserCircle, path: '/itau/analistas', context: 'itau' },
  { label: 'Feedbacks', icon: MessageSquare, path: '/itau/feedbacks', context: 'itau' },
  { label: 'Reuniões', icon: Video, path: '/itau/reunioes', context: 'itau' },
  { label: 'Kanban Itaú', icon: Kanban, path: '/itau/kanban', context: 'itau' },
  { label: 'IA Assistant', icon: Sparkles, path: '/ai' },
];

export function Sidebar() {
  const location = useLocation();
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  // Filtrar itens baseado no tema selecionado
  const filteredNavItems = navItems.filter(item => {
    // Sempre mostrar Dashboard e IA Assistant
    if (!item.context) return true;
    
    // Mostrar item principal do contexto (FIAP ou Itaú)
    if (item.path === '/fiap' || item.path === '/itau') return true;
    
    // Filtrar sub-itens baseado no tema
    return item.context === theme;
  });

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 border-r border-[var(--theme-border)] bg-[var(--theme-card)] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--theme-border)]">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold",
                  theme === 'fiap' && "bg-[var(--theme-accent)] text-[var(--theme-accent-foreground)] glow-effect"
                )}
                style={{
                  backgroundColor: theme === 'itau' ? '#EC7000' : undefined,
                  color: theme === 'itau' ? '#FFFFFF' : undefined
                }}
              >
                D
              </div>
              <span className="font-bold text-[var(--theme-foreground)]">DualOS</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-[var(--theme-hover)] rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-[var(--theme-foreground)]" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-[var(--theme-foreground)]" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                    "text-[var(--theme-foreground)]",
                    isActive && "bg-[var(--theme-accent)] text-[var(--theme-accent-foreground)] font-medium",
                    !isActive && "hover:bg-[var(--theme-hover)]",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive && theme === 'fiap' && "glow-effect"
                  )} />
                  {!collapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-[var(--theme-border)]">
            <div className="text-xs text-[var(--theme-muted-foreground)] text-center">
              {theme === 'fiap' ? 'Education Mode' : 'Corporate Mode'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}