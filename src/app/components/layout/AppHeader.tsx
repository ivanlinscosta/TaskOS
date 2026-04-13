import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { useAppStore } from '../../../stores/useAppStore';
import { useAuth } from '../../../lib/auth-context';
import { db, storage } from '../../../lib/firebase-config';
import { Search, Bell, User, LogOut, Settings, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { getInitials, formatDateTime, cn } from '../../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';

import fiapLogo from '../../../assets/fiap.png';
import itauLogo from '../../../assets/itau.png';

type HeaderProfile = {
  name: string;
  role: string;
  photoURL: string;
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string | Date;
  read: boolean;
};

function getRawPhotoValue(data: any, firebaseUser: any, storeUser: any) {
  return (
    data?.fotoURL ||
    data?.fotoUrl ||
    data?.avatar ||
    data?.foto ||
    data?.photoURL ||
    firebaseUser?.photoURL ||
    storeUser?.photoURL ||
    ''
  );
}

function isDirectImageUrl(value: string) {
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:image/')
  );
}

async function resolveStorageImageUrl(rawValue: string): Promise<string> {
  if (!rawValue) return '';

  if (isDirectImageUrl(rawValue)) {
    return rawValue;
  }

  try {
    // Caso venha como gs://bucket/path
    if (rawValue.startsWith('gs://')) {
      return await getDownloadURL(ref(storage, rawValue));
    }

    // Caso venha só como path do storage: pasta/subpasta/arquivo.jpg
    return await getDownloadURL(ref(storage, rawValue));
  } catch (error) {
    console.error('Erro ao resolver URL da imagem no Storage:', error);
    return '';
  }
}

export function Header() {
  const navigate = useNavigate();
  const { contextMode, setContextMode, user: storeUser } = useAppStore();
  const { user: firebaseUser, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<HeaderProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    carregarPerfil();
    carregarNotificacoes();
  }, [firebaseUser, contextMode]);

  const carregarPerfil = async () => {
    if (!firebaseUser?.uid) {
      setProfile(null);
      return;
    }

    try {
      setIsLoadingProfile(true);

      let profileData: any = null;

      const perfilRef = doc(db, 'usuarios', firebaseUser.uid);
      const perfilSnap = await getDoc(perfilRef);

      if (perfilSnap.exists()) {
        profileData = perfilSnap.data();
      } else {
        const userRef = doc(db, 'usuarios', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          profileData = userSnap.data();
        }
      }

      const rawPhoto = getRawPhotoValue(profileData, firebaseUser, storeUser);
      const resolvedPhotoUrl = await resolveStorageImageUrl(rawPhoto);

      setProfile({
        name:
          profileData?.nome ||
          profileData?.name ||
          firebaseUser.displayName ||
          storeUser?.name ||
          'Usuário',
        role:
          profileData?.cargo ||
          profileData?.funcao ||
          profileData?.role ||
          storeUser?.role ||
          'Usuário do sistema',
        photoURL: resolvedPhotoUrl,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil do header:', error);

      const fallbackRawPhoto = getRawPhotoValue(null, firebaseUser, storeUser);
      const fallbackPhotoUrl = await resolveStorageImageUrl(fallbackRawPhoto);

      setProfile({
        name: firebaseUser.displayName || storeUser?.name || 'Usuário',
        role: storeUser?.role || 'Usuário do sistema',
        photoURL: fallbackPhotoUrl,
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const carregarNotificacoes = async () => {
    setNotifications([]);
  };

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );

  const displayUser = profile || {
    name: firebaseUser?.displayName || storeUser?.name || 'Usuário',
    role: storeUser?.role || 'Usuário do sistema',
    photoURL: '',
  };

  const handleContextSwitch = (mode: 'fiap' | 'itau' | 'pessoal') => {
    setContextMode(mode);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <header
      className="flex h-16 items-center justify-between px-6"
      style={{
        background: 'var(--theme-card)',
        borderBottom: '1px solid var(--theme-border)',
      }}
    >
      <div className="flex flex-1 items-center gap-4">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-96">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: 'var(--theme-muted-foreground)' }}
              />
              <Input
                placeholder="Buscar em todo o sistema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="pl-10"
                style={{
                  background: 'var(--theme-background)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-foreground)',
                }}
              />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-96 p-0" align="start">
            <div className="p-4">
              <p className="text-sm" style={{ color: 'var(--theme-muted-foreground)' }}>
                {searchQuery
                  ? 'Nenhum resultado encontrado'
                  : 'Digite para buscar alunos, analistas, tarefas...'}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div
          className="mr-1 flex items-center gap-1 rounded-xl p-1 shadow-sm"
          style={{ background: 'var(--theme-background-secondary)' }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleContextSwitch('fiap')}
            className={cn(
              'h-8 gap-2 rounded-lg px-3 text-xs',
              contextMode === 'fiap' && 'shadow-sm'
            )}
            style={
              contextMode === 'fiap'
                ? {
                    background: 'var(--theme-card)',
                    color: 'var(--theme-foreground)',
                  }
                : {
                    color: 'var(--theme-muted-foreground)',
                  }
            }
          >
            <img src={fiapLogo} alt="FIAP" className="h-3.5 w-auto object-contain" />
            FIAP
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleContextSwitch('itau')}
            className={cn(
              'h-8 gap-2 rounded-lg px-3 text-xs',
              contextMode === 'itau' && 'shadow-sm'
            )}
            style={
              contextMode === 'itau'
                ? {
                    background: 'var(--theme-accent)',
                    color: 'var(--theme-accent-foreground)',
                  }
                : {
                    color: 'var(--theme-muted-foreground)',
                  }
            }
          >
            <img src={itauLogo} alt="Itaú" className="h-3.5 w-auto object-contain" />
            Itaú
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleContextSwitch('pessoal')}
            className={cn(
              'h-8 gap-2 rounded-lg px-3 text-xs',
              contextMode === 'pessoal' && 'shadow-sm'
            )}
            style={
              contextMode === 'pessoal'
                ? {
                    background: '#059669',
                    color: '#FFFFFF',
                  }
                : {
                    color: 'var(--theme-muted-foreground)',
                  }
            }
          >
            <Home className="h-3.5 w-3.5" />
            Pessoal
          </Button>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b p-4">
              <h3 className="font-semibold">Notificações</h3>
              <p className="text-sm" style={{ color: 'var(--theme-muted-foreground)' }}>
                {unreadNotifications.length} não lidas
              </p>
            </div>

            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm" style={{ color: 'var(--theme-muted-foreground)' }}>
                  Nenhuma notificação
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="cursor-pointer p-4"
                      style={{
                        background: notification.read ? 'transparent' : 'var(--theme-hover)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="mt-1 text-sm" style={{ color: 'var(--theme-muted-foreground)' }}>
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs" style={{ color: 'var(--theme-muted-foreground)' }}>
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>

                        {!notification.read && (
                          <div
                            className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                            style={{ background: 'var(--theme-accent)' }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                {displayUser?.photoURL ? (
                  <AvatarImage src={displayUser.photoURL} />
                ) : (
                  <AvatarFallback
                    style={{
                      background: 'var(--theme-accent)',
                      color: 'var(--theme-accent-foreground)',
                    }}
                  >
                    {getInitials(displayUser?.name || 'Usuário')}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium">
                  {isLoadingProfile ? 'Carregando...' : displayUser?.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--theme-muted-foreground)' }}>
                  {displayUser?.role}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate('/perfil')}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;