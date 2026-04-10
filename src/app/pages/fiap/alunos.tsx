import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Mail, Pencil, GraduationCap, Star, Loader } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import * as alunosService from '../../../services/alunos-service';
import { mockAlunos } from '../../../lib/mock-data';

export function Alunos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [alunos, setAlunos] = useState(mockAlunos);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAluno, setSelectedAluno] = useState(mockAlunos[0]);

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      setIsLoading(true);
      const alunosFirebase = await alunosService.listarAlunos();
      if (alunosFirebase && alunosFirebase.length > 0) {
        setAlunos(alunosFirebase as any);
        setSelectedAluno(alunosFirebase[0] as any);
      } else {
        setAlunos(mockAlunos);
        setSelectedAluno(mockAlunos[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast.error('Erro ao carregar alunos');
      setAlunos(mockAlunos);
      setSelectedAluno(mockAlunos[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.curso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularMedia = (aluno: any) => {
    if (!aluno.notas || aluno.notas.length === 0) return 0;
    const soma = aluno.notas.reduce((acc: number, nota: any) => acc + nota.valor, 0);
    return (soma / aluno.notas.length).toFixed(1);
  };

  const calcularPresenca = (aluno: any) => {
    return 85 + (parseInt(aluno.id || '0') % 15);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--theme-foreground)]">Gestão de Alunos</h1>
          <p className="text-xs text-[var(--theme-muted-foreground)] mt-0.5">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="w-3 h-3 animate-spin" />
                Carregando...
              </span>
            ) : (
              `${filteredAlunos.length} alunos cadastrados`
            )}
          </p>
        </div>
        <Button variant="theme" size="sm" className="gap-2" onClick={() => navigate('/fiap/alunos/novo')}>
          <Plus className="w-4 h-4" />
          Novo Aluno
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-muted-foreground)]" />
        <Input
          placeholder="Buscar por nome, email ou curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Alunos Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-[var(--theme-accent)]" />
        </div>
      ) : filteredAlunos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--theme-muted-foreground)]">Nenhum aluno encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAlunos.map(aluno => {
            const media = calcularMedia(aluno);
            const presenca = calcularPresenca(aluno);

            return (
              <Dialog key={aluno.id}>
                <Card className="relative group overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/fiap/alunos/editar/${aluno.id}`);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-[var(--theme-background-secondary)] hover:bg-[var(--theme-accent)] hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>

                    <DialogTrigger asChild>
                      <div className="cursor-pointer" onClick={() => setSelectedAluno(aluno)}>
                        {/* Header com Avatar */}
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="h-14 w-14 border-2 border-[var(--theme-accent)]">
                            <AvatarImage src={aluno.foto} />
                            <AvatarFallback>{aluno.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-[var(--theme-foreground)] mb-1 truncate">
                              {aluno.nome}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-[var(--theme-muted-foreground)] mb-1">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{aluno.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[var(--theme-muted-foreground)]">
                              <GraduationCap className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{aluno.curso}</span>
                            </div>
                          </div>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center p-2 rounded-lg bg-[var(--theme-background-secondary)]">
                            <div className="text-lg font-bold text-[var(--theme-foreground)]">
                              {media}
                            </div>
                            <div className="text-[10px] text-[var(--theme-muted-foreground)]">Média</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-[var(--theme-background-secondary)]">
                            <div className="text-lg font-bold text-[var(--theme-foreground)]">
                              {presenca}%
                            </div>
                            <div className="text-[10px] text-[var(--theme-muted-foreground)]">Presença</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-[var(--theme-background-secondary)]">
                            <div className="text-lg font-bold text-[var(--theme-foreground)]">
                              {aluno.notas?.length || 0}
                            </div>
                            <div className="text-[10px] text-[var(--theme-muted-foreground)]">Notas</div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={parseFloat(media) >= 7 ? 'default' : 'destructive'}
                            className="text-[10px] px-2 py-0.5"
                          >
                            {parseFloat(media) >= 7 ? 'Aprovado' : 'Atenção'}
                          </Badge>
                          {parseFloat(media) >= 9 && (
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-yellow-500" />
                              <span className="text-[10px] font-medium">Destaque</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogTrigger>
                  </CardContent>
                </Card>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
}
