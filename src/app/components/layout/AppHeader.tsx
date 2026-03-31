import { useState } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { Search, Bell, User, GraduationCap, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Badge } from '../ui/badge';
import { mockNotifications } from '../../../lib/mockData';
import { getInitials, formatDateTime } from '../../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../../lib/utils';

export default function AppHeader() {
  const { contextMode, setContextMode, user } = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = mockNotifications.filter((n) => !n.read);

  const handleContextSwitch = (mode: 'fiap' | 'itau') => {
    setContextMode(mode);
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-1">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar em todo o sistema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="pl-10"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="start">
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'Nenhum resultado encontrado'
                  : 'Digite para buscar alunos, analistas, tarefas...'}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Center: Context Switcher */}
      <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
        <Button
          variant={contextMode === 'fiap' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleContextSwitch('fiap')}
          className={cn(
            'gap-2',
            contextMode === 'fiap' &&
              'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          <GraduationCap className="h-4 w-4" />
          FIAP
        </Button>
        <Button
          variant={contextMode === 'itau' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleContextSwitch('itau')}
          className={cn(
            'gap-2',
            contextMode === 'itau' &&
              'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          <Building2 className="h-4 w-4" />
          Itaú
        </Button>
      </div>

      {/* Right: Notifications & User */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Notificações</h3>
              <p className="text-sm text-muted-foreground">
                {unreadNotifications.length} não lidas
              </p>
            </div>
            <ScrollArea className="h-96">
              {mockNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                <div className="divide-y">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-accent/50 cursor-pointer transition-colors',
                        !notification.read && 'bg-accent/30'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
