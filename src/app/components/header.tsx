import { Bell, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useTheme } from '../../lib/theme-context';
import { cn } from '../../lib/cn';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { NotificationsHub } from './notifications-hub';
import { QuickActions } from './quick-actions';
import logoItau from '../../assets/itau.png';
import logoFiap from '../../assets/fiap.png';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-[var(--theme-border)] bg-[var(--theme-card)] sticky top-0 z-40">
        <div className="h-full px-4 flex items-center justify-between gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                theme === 'fiap' && "bg-[var(--theme-accent)] text-[var(--theme-accent-foreground)] glow-effect"
              )}
              style={{
                backgroundColor: theme === 'itau' ? '#EC7000' : undefined,
                color: theme === 'itau' ? '#FFFFFF' : undefined
              }}
            >
              D
            </div>
            <span className="font-bold text-[var(--theme-foreground)] hidden sm:block">DualOS</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher com Logos */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--theme-background-secondary)] border border-[var(--theme-border)]">
              <button
                onClick={() => toggleTheme('fiap')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                  theme === 'fiap' 
                    ? "bg-[#6A0DAD] shadow-md" 
                    : "hover:bg-[var(--theme-hover)]"
                )}
              >
                <img 
                  src={logoFiap} 
                  alt="FIAP" 
                  className="h-4 w-auto"
                  style={{ filter: theme === 'fiap' ? 'brightness(0) invert(1)' : 'none' }}
                />
              </button>
              <button
                onClick={() => toggleTheme('itau')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                  theme === 'itau' 
                    ? "bg-[#EC7000] shadow-md" 
                    : "hover:bg-[var(--theme-hover)]"
                )}
              >
                <img 
                  src={logoItau} 
                  alt="Itaú" 
                  className="h-4 w-auto"
                  style={{ filter: theme === 'itau' ? 'brightness(0) invert(1)' : 'none' }}
                />
              </button>
            </div>

            {/* Quick Actions */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 relative"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              <Zap className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-4 h-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
              >
                3
              </Badge>
            </Button>

            {/* User Avatar */}
            <button 
              onClick={() => navigate('/perfil')}
              className="flex items-center gap-2 pl-2 ml-2 border-l border-[var(--theme-border)] hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-[var(--theme-foreground)]">
                  Carlos Eduardo
                </div>
                <div className="text-[10px] text-[var(--theme-muted-foreground)]">
                  {theme === 'fiap' ? 'Professor' : 'Gerente'}
                </div>
              </div>
              <Avatar className="h-8 w-8 border-2 border-[var(--theme-accent)]">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" />
                <AvatarFallback>CE</AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      {showNotifications && <NotificationsHub onClose={() => setShowNotifications(false)} />}
      {showQuickActions && <QuickActions onClose={() => setShowQuickActions(false)} />}
    </>
  );
}