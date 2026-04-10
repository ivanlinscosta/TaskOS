import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Loader, Star, CalendarCheck2, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import * as alunosService from '../../../services/alunos-service';
import { mockAlunos } from '../../../lib/mock-data';
import { PersonSummaryCard } from '../../components/ui/person-summary-card';

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
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-foreground)]">Gestão de Alunos</h1>
          <p className="mt-1 text-sm text-[var(--theme-muted-foreground)]">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-3.5 w-3.5 animate-spin" />
                Carregando...
              </span>
            ) : (
              `${filteredAlunos.length} alunos cadastrados`
            )}
          </p>
        </div>

        <Button variant="theme" size="sm" className="gap-2 rounded-xl px-4" onClick={() => navigate('/fiap/alunos/novo')}>
          <Plus className="w-4 h-4" />
          Novo Aluno
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-muted-foreground)]" />
        <Input
          placeholder="Buscar por nome, email ou curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 rounded-xl pl-9 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-14">
          <Loader className="h-8 w-8 animate-spin text-[var(--theme-accent)]" />
        </div>
      ) : filteredAlunos.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-[var(--theme-muted-foreground)]">Nenhum aluno encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAlunos.map((aluno) => {
            const media = calcularMedia(aluno);
            const presenca = calcularPresenca(aluno);

            return (
              <Dialog key={aluno.id}>
                <DialogTrigger asChild>
                  <div>
                    <PersonSummaryCard
                      variant="student"
                      name={aluno.nome}
                      email={aluno.email}
                      subtitle={aluno.curso}
                      image={aluno.foto}
                      badgeText={parseFloat(media as string) >= 7 ? 'Aprovado' : 'Atenção'}
                      highlightText={parseFloat(media as string) >= 9 ? 'Destaque' : undefined}
                      locationText={`Presença ${presenca}%`}
                      description="Visualize desempenho, notas e registre feedbacks para o aluno."
                      actionLabel="Registrar feedback"
                      onAction={() => navigate(`/fiap/alunos/feedback/${aluno.id}`)}
                      onOpen={() => setSelectedAluno(aluno)}
                      onEdit={(e) => {
                        e.stopPropagation();
                        navigate(`/fiap/alunos/editar/${aluno.id}`);
                      }}
                      metrics={[
                        {
                          label: 'média',
                          value: media,
                          icon: <Star className="h-3.5 w-3.5" />,
                        },
                        {
                          label: 'presença',
                          value: `${presenca}%`,
                          icon: <CalendarCheck2 className="h-3.5 w-3.5" />,
                        },
                        {
                          label: 'notas',
                          value: aluno.notas?.length || 0,
                          icon: <GraduationCap className="h-3.5 w-3.5" />,
                        },
                      ]}
                    />
                  </div>
                </DialogTrigger>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
}