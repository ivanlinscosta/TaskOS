import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  Calendar,
  Kanban,
  MessageSquare,
  Video,
  ChevronLeft,
  ChevronRight,
  Plane,
  Wallet,
  CheckSquare,
  Home,
  MessagesSquare,
} from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { cn } from '../../../lib/utils';
import { TaskOSRadarIcon } from '../TaskOSRadarIcon';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  contexts: Array<'fiap' | 'itau' | 'pessoal' | 'admin'>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', contexts: ['fiap', 'itau'] },

  // FIAP
  { label: 'Alunos', icon: Users, path: '/fiap/alunos', contexts: ['fiap'] },
  { label: 'Aulas', icon: BookOpen, path: '/fiap/aulas', contexts: ['fiap'] },
  { label: 'Cronograma', icon: Calendar, path: '/fiap/cronograma', contexts: ['fiap'] },
  { label: 'Kanban FIAP', icon: Kanban, path: '/fiap/kanban', contexts: ['fiap'] },

  // Itaú
  { label: 'Analistas', icon: Users, path: '/itau/analistas', contexts: ['itau'] },
  { label: 'Feedbacks', icon: MessageSquare, path: '/itau/feedbacks', contexts: ['itau'] },
  { label: 'Reuniões', icon: Video, path: '/itau/reunioes', contexts: ['itau'] },
  { label: 'Kanban Itaú', icon: Kanban, path: '/itau/kanban', contexts: ['itau'] },

  // Vida Pessoal
  { label: 'Visão Geral', icon: Home, path: '/pessoal', contexts: ['pessoal'] },
  { label: 'Viagens', icon: Plane, path: '/pessoal/viagens', contexts: ['pessoal'] },
  { label: 'Finanças', icon: Wallet, path: '/pessoal/custos', contexts: ['pessoal'] },
  { label: 'Tarefas', icon: CheckSquare, path: '/pessoal/tarefas', contexts: ['pessoal'] },

  // Shared
  { label: 'AI Assistant', icon: Sparkles,        path: '/ai',   contexts: ['fiap', 'itau', 'pessoal', 'admin'] },
  { label: 'Chat Guiado',  icon: MessagesSquare,  path: '/chat', contexts: ['fiap', 'itau', 'pessoal', 'admin'] },
];

const modeLabels: Record<string, string> = {
  fiap: 'Education Mode',
  itau: 'Corporate Mode',
  pessoal: 'Personal Mode',
  admin: 'Admin Mode',
};

export default function AppSidebar() {
  const location = useLocation();
  const { contextMode, sidebarCollapsed, toggleSidebar } = useAppStore();

  const visibleItems = navItems.filter((item) =>
    item.contexts.includes(contextMode as any)
  );

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen flex-col border-r transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
      style={{
        background: 'var(--theme-card)',
        borderColor: 'var(--theme-border)',
      }}
    >
      <div
        className="flex h-16 items-center justify-between px-4"
        style={{ borderBottom: '1px solid var(--theme-border)' }}
      >
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5">
            <TaskOSRadarIcon size={36} />
            <div className="leading-tight">
              <span
                className="block text-xl font-bold"
                style={{ color: 'var(--theme-foreground)' }}
              >
                TaskOS
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--theme-muted-foreground)' }}
              >
                {modeLabels[contextMode] || 'Mode'}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className={cn('rounded-lg p-1.5 transition-colors', sidebarCollapsed && 'mx-auto')}
          style={{ color: 'var(--theme-foreground)' }}
          title={sidebarCollapsed ? 'Expandir' : 'Recolher'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Collapsed: mini icon centred at top of nav */}
      {sidebarCollapsed && (
        <div className="flex justify-center py-3" style={{ borderBottom: '1px solid var(--theme-border)' }}>
          <TaskOSRadarIcon size={30} />
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                  sidebarCollapsed && 'justify-center'
                )}
                style={
                  isActive
                    ? {
                        background: 'var(--theme-accent)',
                        color: 'var(--theme-accent-foreground)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                      }
                    : {
                        color: 'var(--theme-foreground)',
                      }
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'scale-105')} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {!sidebarCollapsed && (
        <div
          className="p-4 text-center text-xs"
          style={{
            borderTop: '1px solid var(--theme-border)',
            color: 'var(--theme-muted-foreground)',
          }}
        >
          {modeLabels[contextMode] || 'Mode'}
        </div>
      )}
    </aside>
  );
}
