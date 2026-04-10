import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Mail, Briefcase, Pencil, Star, Loader } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import * as analistasService from '../../../services/analistas-service';
import { mockAnalistas } from '../../../lib/mock-data';

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
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--theme-foreground)]">Gestão de Analistas</h1>
          <p className="text-xs text-[var(--theme-muted-foreground)] mt-0.5">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="w-3 h-3 animate-spin" />
                Carregando...
              </span>
            ) : (
              `${filteredAnalistas.length} analistas no time`
            )}
          </p>
        </div>
        <Button variant="theme" size="sm" className="gap-2" onClick={() => navigate('/itau/analistas/novo')}>
          <Plus className="w-4 h-4" />
          Novo Analista
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-muted-foreground)]" />
        <Input
          placeholder="Buscar por nome, email ou função..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Analistas Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-[var(--theme-accent)]" />
        </div>
      ) : filteredAnalistas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--theme-muted-foreground)]">Nenhum analista encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAnalistas.map(analista => {
            const mediaAvaliacoes = calcularMediaAvaliacoes(analista);

            return (
              <Dialog key={analista.id}>
                <Card className="relative group overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/itau/analistas/editar/${analista.id}`);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-[var(--theme-background-secondary)] hover:bg-[var(--theme-accent)] hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>

                    <DialogTrigger asChild>
                      <div className="cursor-pointer" onClick={() => setSelectedAnalista(analista)}>
                        {/* Header com Avatar */}
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="h-14 w-14 border-2 border-[var(--theme-accent)]">
                            <AvatarImage src={analista.foto} />
                            <AvatarFallback>
                              {analista.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-[var(--theme-foreground)] mb-1 truncate">
                              {analista.nome}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-[var(--theme-muted-foreground)] mb-1">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{analista.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[var(--theme-muted-foreground)]">
                              <Briefcase className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{analista.funcao}</span>
                            </div>
                          </div>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center p-2 rounded-lg bg-[var(--theme-background-secondary)]">
                            <div className="text-lg font-bold text-[var(--theme-foreground)]">
                              {mediaAvaliacoes}
                            </div>
                            <div className="text-[10px] text-[var(--theme-muted-foreground)]">Média</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-[var(--theme-background-secondary)]">
                            <div className="text-lg font-bold text-[var(--theme-foreground)]">
                              {analista.squad || '-'}
                            </div>
                            <div className="text-[10px] text-[var(--theme-muted-foreground)]">Squad</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-[var(--theme-background-secondary)]">
                            <div className="text-lg font-bold text-[var(--theme-foreground)]">
                              {calcularTempoEmpresa(analista.dataAdmissao)}
                            </div>
                            <div className="text-[10px] text-[var(--theme-muted-foreground)]">Tempo</div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={parseFloat(mediaAvaliacoes) >= 8 ? 'default' : 'secondary'}
                            className="text-[10px] px-2 py-0.5"
                          >
                            {analista.senioridade || 'Pleno'}
                          </Badge>
                          {parseFloat(mediaAvaliacoes) >= 9 && (
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-yellow-500" />
                              <span className="text-[10px] font-medium">Top</span>
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
