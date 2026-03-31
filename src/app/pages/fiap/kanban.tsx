import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Calendar, Users, AlertCircle, Circle, Clock, CheckCircle2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockTarefas } from '../../../lib/mock-data';
import { Tarefa } from '../../../types';
import { cn } from '../../../lib/cn';

export function KanbanFIAP() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tarefas] = useState(mockTarefas.filter(t => t.contexto === 'fiap'));

  const columns = [
    { id: 'backlog', title: 'Backlog', icon: Circle },
    { id: 'doing', title: 'Em Progresso', icon: Clock },
    { id: 'done', title: 'Concluído', icon: CheckCircle2 },
  ] as const;

  const getPrioridadeColor = (prioridade: Tarefa['prioridade']) => {
    const colors = {
      baixa: 'bg-gray-500',
      media: 'bg-blue-500',
      alta: 'bg-orange-500',
      critica: 'bg-red-500',
    };
    return colors[prioridade];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">Kanban FIAP</h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            Gerencie tarefas e projetos acadêmicos
          </p>
        </div>
        <Button variant="theme" className="gap-2" onClick={() => navigate('/fiap/kanban/nova')}>
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => {
          const columnTarefas = tarefas.filter(t => t.status === column.id);
          const Icon = column.icon;

          return (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <Card className="bg-[var(--theme-background-secondary)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-[var(--theme-accent)]" />
                      <span>{column.title}</span>
                    </div>
                    <Badge variant="secondary">{columnTarefas.length}</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Tasks */}
              <div className="space-y-3">
                {columnTarefas.map(tarefa => (
                  <Card 
                    key={tarefa.id} 
                    className="cursor-move hover:shadow-lg transition-all group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-4 h-4 text-[var(--theme-muted-foreground)] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-[var(--theme-foreground)]">
                              {tarefa.titulo}
                            </h4>
                            <div className={cn(
                              "w-2 h-2 rounded-full flex-shrink-0 mt-2",
                              getPrioridadeColor(tarefa.prioridade)
                            )} />
                          </div>

                          <p className="text-sm text-[var(--theme-muted-foreground)]">
                            {tarefa.descricao}
                          </p>

                          {/* Checklist Progress */}
                          {tarefa.checklist && tarefa.checklist.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-[var(--theme-muted-foreground)]">
                                <span>Progresso</span>
                                <span>
                                  {tarefa.checklist.filter(c => c.concluido).length}/{tarefa.checklist.length}
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-[var(--theme-muted)] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[var(--theme-accent)] transition-all"
                                  style={{
                                    width: `${(tarefa.checklist.filter(c => c.concluido).length / tarefa.checklist.length) * 100}%`
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {tarefa.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Card */}
                <button className="w-full p-4 rounded-lg border-2 border-dashed border-[var(--theme-border)] hover:border-[var(--theme-accent)] hover:bg-[var(--theme-hover)] transition-colors text-sm text-[var(--theme-muted-foreground)] hover:text-[var(--theme-foreground)]">
                  + Adicionar tarefa
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}