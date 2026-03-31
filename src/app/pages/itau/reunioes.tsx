import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Calendar, Clock, MapPin, Users, Video, ChevronRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockReunioes } from '../../../lib/mock-data';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../lib/cn';

export function Reunioes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    const colors = {
      agendada: 'bg-blue-500',
      concluida: 'bg-green-500',
      cancelada: 'bg-red-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      agendada: 'default' as const,
      concluida: 'secondary' as const,
      cancelada: 'destructive' as const,
    };
    return variants[status as keyof typeof variants] || 'default';
  };

  const filteredReunioes = mockReunioes.filter(reuniao =>
    reuniao.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Gestão de Reuniões</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            {filteredReunioes.length} reuniões agendadas
          </p>
        </div>
        <Button variant="theme" className="gap-2" onClick={() => navigate('/itau/reunioes/nova')}>
          <Plus className="w-4 h-4" />
          Nova Reunião
        </Button>
      </div>

      {/* Reuniões List */}
      <div className="space-y-4">
        {filteredReunioes.map(reuniao => (
          <Card key={reuniao.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-5 h-5 text-[var(--theme-accent)]" />
                    <CardTitle className="text-xl">{reuniao.titulo}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getStatusBadge(reuniao.status)}>
                      {reuniao.status}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(reuniao.data, "d 'de' MMM, yyyy", { locale: ptBR })}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {format(reuniao.data, 'HH:mm')} • {reuniao.duracao} min
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users className="w-3 h-3" />
                      {reuniao.participantes.length} participantes
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Participantes */}
              <div>
                <h4 className="font-semibold mb-2 text-[var(--theme-foreground)]">
                  Participantes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {reuniao.participantes.map((participante, index) => (
                    <Badge key={index} variant="secondary">
                      {participante}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notas */}
              {reuniao.notas && (
                <div>
                  <h4 className="font-semibold mb-2 text-[var(--theme-foreground)]">
                    Notas da Reunião
                  </h4>
                  <p className="text-sm text-[var(--theme-muted-foreground)] p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                    {reuniao.notas}
                  </p>
                </div>
              )}

              {/* Resumo IA */}
              {reuniao.resumoIA && (
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-semibold mb-2 text-purple-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Resumo Gerado por IA
                  </h4>
                  <p className="text-sm text-[var(--theme-foreground)]">
                    {reuniao.resumoIA}
                  </p>
                </div>
              )}

              {/* Ações */}
              {reuniao.acoes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-[var(--theme-foreground)]">
                    Ações e Combinados ({reuniao.acoes.length})
                  </h4>
                  <div className="space-y-2">
                    {reuniao.acoes.map(acao => (
                      <div 
                        key={acao.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-[var(--theme-background-secondary)]"
                      >
                        <div className="mt-1">
                          {acao.status === 'concluida' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : acao.status === 'em_progresso' ? (
                            <Clock className="w-4 h-4 text-blue-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm text-[var(--theme-foreground)] mb-1",
                            acao.status === 'concluida' && "line-through text-[var(--theme-muted-foreground)]"
                          )}>
                            {acao.descricao}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[var(--theme-muted-foreground)]">
                            <span>Responsável: {acao.responsavel}</span>
                            <span>•</span>
                            <span>Prazo: {format(acao.prazo, "d 'de' MMM", { locale: ptBR })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}