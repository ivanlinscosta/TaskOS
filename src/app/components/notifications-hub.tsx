import { X, CheckCheck, Trash2, Bell } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../../lib/cn';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  tipo: 'tarefa' | 'reuniao' | 'aula' | 'feedback' | 'sistema';
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  contexto: 'fiap' | 'itau';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    tipo: 'tarefa',
    titulo: 'Tarefa Urgente',
    mensagem: 'Revisar projeto de IA até amanhã',
    data: new Date(2026, 2, 31, 14, 30),
    lida: false,
    contexto: 'fiap'
  },
  {
    id: '2',
    tipo: 'reuniao',
    titulo: 'Reunião em 1 hora',
    mensagem: 'Sprint Planning com time de Analytics',
    data: new Date(2026, 2, 31, 15, 0),
    lida: false,
    contexto: 'itau'
  },
  {
    id: '3',
    tipo: 'aula',
    titulo: 'Aula agendada',
    mensagem: 'Machine Learning - Turma 2TDSPV às 19h',
    data: new Date(2026, 2, 31, 19, 0),
    lida: false,
    contexto: 'fiap'
  },
  {
    id: '4',
    tipo: 'feedback',
    titulo: 'Novo feedback recebido',
    mensagem: 'João Silva deixou um comentário',
    data: new Date(2026, 2, 31, 10, 15),
    lida: true,
    contexto: 'itau'
  },
  {
    id: '5',
    tipo: 'sistema',
    titulo: 'Backup concluído',
    mensagem: 'Todos os dados foram salvos com sucesso',
    data: new Date(2026, 2, 31, 8, 0),
    lida: true,
    contexto: 'fiap'
  }
];

interface NotificationsHubProps {
  onClose: () => void;
}

export function NotificationsHub({ onClose }: NotificationsHubProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, lida: true }))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.lida).length;

  const getTipoIcon = (tipo: string) => {
    const icons = {
      tarefa: '✓',
      reuniao: '📅',
      aula: '📚',
      feedback: '💬',
      sistema: '⚙️'
    };
    return icons[tipo as keyof typeof icons] || '•';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <Card className="relative w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border-2 border-[var(--theme-border)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--theme-border)] bg-[var(--theme-card)]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--theme-accent)]" />
            <h2 className="text-base font-bold text-[var(--theme-foreground)]">
              Notificações
            </h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs h-7"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="flex-1 overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto mb-3 text-[var(--theme-muted-foreground)] opacity-50" />
              <p className="text-sm text-[var(--theme-muted-foreground)]">
                Nenhuma notificação
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-3 rounded-lg transition-all group hover:bg-[var(--theme-hover)]",
                    !notif.lida && "bg-[var(--theme-accent)]/5 border-l-2 border-l-[var(--theme-accent)]",
                    notif.lida && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl flex-shrink-0">
                      {getTipoIcon(notif.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-medium text-[var(--theme-foreground)]">
                          {notif.titulo}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 flex-shrink-0"
                          style={{
                            borderColor: notif.contexto === 'fiap' ? '#6A0DAD' : '#EC7000',
                            color: notif.contexto === 'fiap' ? '#6A0DAD' : '#EC7000'
                          }}
                        >
                          {notif.contexto.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--theme-muted-foreground)] mb-2">
                        {notif.mensagem}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[var(--theme-muted-foreground)]">
                          {format(notif.data, "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.lida && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="h-6 w-6"
                              title="Marcar como lida"
                            >
                              <CheckCheck className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(notif.id)}
                            className="h-6 w-6 text-red-500 hover:text-red-600"
                            title="Excluir"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
