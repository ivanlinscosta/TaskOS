import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Loader, Star, Users, Clock3 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import * as analistasService from '../../../services/analistas-service';
import { mockAnalistas } from '../../../lib/mock-data';
import { PersonSummaryCard } from '../../components/ui/person-summary-card';

export function Analistas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [analistas, setAnalistas] = useState(mockAnalistas);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnalista, setSelectedAnalista] = useState(mockAnalistas[0]);

  useEffect(() => {
    carregarAnalistas();
  }, []);

  const carregarAnalistas = async () => {
    try {
      setIsLoading(true);
      const analistasFirebase = await analistasService.listarAnalistas();
      if (analistasFirebase && analistasFirebase.length > 0) {
        setAnalistas(analistasFirebase as any);
        setSelectedAnalista(analistasFirebase[0] as any);
      } else {
        setAnalistas(mockAnalistas);
        setSelectedAnalista(mockAnalistas[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar analistas:', error);
      toast.error('Erro ao carregar analistas');
      setAnalistas(mockAnalistas);
      setSelectedAnalista(mockAnalistas[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAnalistas = analistas.filter(analista =>
    analista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analista.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analista.funcao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularMediaAvaliacoes = (analista: any) => {
    if (!analista.avaliacoes || analista.avaliacoes.length === 0) return 0;
    const soma = analista.avaliacoes.reduce((acc: number, av: any) => acc + av.nota, 0);
    return (soma / analista.avaliacoes.length).toFixed(1);
  };

  const calcularTempoEmpresa = (dataAdmissao: any) => {
    const hoje = new Date();
    const diff = hoje.getTime() - new Date(dataAdmissao).getTime();
    const anos = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const meses = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

    if (anos > 0) {
      return `${anos}a ${meses}m`;
    }
    return `${meses} meses`;
  };

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-foreground)]">Gestão de Analistas</h1>
          <p className="mt-1 text-sm text-[var(--theme-muted-foreground)]">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-3.5 w-3.5 animate-spin" />
                Carregando...
              </span>
            ) : (
              `${filteredAnalistas.length} analistas no time`
            )}
          </p>
        </div>

        <Button variant="theme" size="sm" className="gap-2 rounded-xl px-4" onClick={() => navigate('/itau/analistas/novo')}>
          <Plus className="w-4 h-4" />
          Novo Analista
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-muted-foreground)]" />
        <Input
          placeholder="Buscar por nome, email ou função..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 rounded-xl pl-9 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-14">
          <Loader className="h-8 w-8 animate-spin text-[var(--theme-accent)]" />
        </div>
      ) : filteredAnalistas.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-[var(--theme-muted-foreground)]">Nenhum analista encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAnalistas.map((analista) => {
            const mediaAvaliacoes = calcularMediaAvaliacoes(analista);

            return (
              <Dialog key={analista.id}>
                <DialogTrigger asChild>
                  <div>
                    <PersonSummaryCard
                      variant="analyst"
                      name={analista.nome}
                      email={analista.email}
                      subtitle={analista.funcao}
                      image={analista.foto}
                      badgeText={analista.senioridade || 'Pleno'}
                      highlightText={parseFloat(mediaAvaliacoes as string) >= 9 ? 'Top' : undefined}
                      locationText={analista.squad || 'Sem squad'}
                      description="Acompanhe avaliações, feedbacks e evolução profissional do analista."
                      actionLabel="Registrar avaliação"
                      onAction={() => navigate(`/itau/analistas/avaliacao/${analista.id}`)}
                      onOpen={() => setSelectedAnalista(analista)}
                      onEdit={(e) => {
                        e.stopPropagation();
                        navigate(`/itau/analistas/editar/${analista.id}`);
                      }}
                      metrics={[
                        {
                          label: 'média',
                          value: mediaAvaliacoes,
                          icon: <Star className="h-3.5 w-3.5" />,
                        },
                        {
                          label: 'squad',
                          value: analista.squad || '-',
                          icon: <Users className="h-3.5 w-3.5" />,
                        },
                        {
                          label: 'tempo',
                          value: calcularTempoEmpresa(analista.dataAdmissao),
                          icon: <Clock3 className="h-3.5 w-3.5" />,
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