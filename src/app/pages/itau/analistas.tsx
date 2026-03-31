import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Mail, Briefcase, TrendingUp, DollarSign, Pencil, Calendar, Award, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { mockAnalistas } from '../../../lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Analistas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalista, setSelectedAnalista] = useState(mockAnalistas[0]);

  const filteredAnalistas = mockAnalistas.filter(analista =>
    analista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analista.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analista.funcao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularMediaAvaliacoes = (analista: typeof mockAnalistas[0]) => {
    if (analista.avaliacoes.length === 0) return 0;
    const soma = analista.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
    return (soma / analista.avaliacoes.length).toFixed(1);
  };

  const calcularTempoEmpresa = (dataAdmissao: Date) => {
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
            {filteredAnalistas.length} analistas no time
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
                            {analista.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
                          <div className="text-[10px] text-[var(--theme-muted-foreground)]">Avaliação</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-[var(--theme-background-secondary)]">
                          <div className="text-lg font-bold text-[var(--theme-foreground)]">
                            {analista.avaliacoes.length}
                          </div>
                          <div className="text-[10px] text-[var(--theme-muted-foreground)]">Reviews</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-[var(--theme-background-secondary)]">
                          <div className="text-xs font-bold text-[var(--theme-foreground)]">
                            {calcularTempoEmpresa(analista.dataAdmissao)}
                          </div>
                          <div className="text-[10px] text-[var(--theme-muted-foreground)]">Tempo</div>
                        </div>
                      </div>

                      {/* Status e Informações Extras */}
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={parseFloat(mediaAvaliacoes) >= 8 ? 'default' : 'secondary'}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {parseFloat(mediaAvaliacoes) >= 8 ? 'Alto Desempenho' : 'Bom Desempenho'}
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

              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-[var(--theme-accent)]">
                        <AvatarImage src={selectedAnalista.foto} />
                        <AvatarFallback>
                          {selectedAnalista.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xl">{selectedAnalista.nome}</div>
                        <div className="text-sm font-normal text-[var(--theme-muted-foreground)]">
                          {selectedAnalista.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="theme"
                      size="sm"
                      onClick={() => navigate(`/itau/analistas/${selectedAnalista.id}/avaliacao`)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nova Avaliação
                    </Button>
                  </DialogTitle>
                  <DialogDescription>{selectedAnalista.funcao}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Informações Gerais */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                      <div className="text-2xl font-bold text-[var(--theme-foreground)]">
                        {calcularMediaAvaliacoes(selectedAnalista)}
                      </div>
                      <div className="text-xs text-[var(--theme-muted-foreground)]">Média Geral</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <div className="text-base font-bold text-[var(--theme-foreground)]">
                        {calcularTempoEmpresa(selectedAnalista.dataAdmissao)}
                      </div>
                      <div className="text-xs text-[var(--theme-muted-foreground)]">Tempo de Casa</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      <Award className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <div className="text-2xl font-bold text-[var(--theme-foreground)]">
                        {selectedAnalista.avaliacoes.length}
                      </div>
                      <div className="text-xs text-[var(--theme-muted-foreground)]">Avaliações</div>
                    </div>
                  </div>

                  {/* Salário e Admissão */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      <div className="flex items-center gap-2 text-[var(--theme-muted-foreground)] mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs">Salário Atual</span>
                      </div>
                      <div className="text-xl font-bold text-[var(--theme-foreground)]">
                        {selectedAnalista.salario?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      <div className="flex items-center gap-2 text-[var(--theme-muted-foreground)] mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Data de Admissão</span>
                      </div>
                      <div className="text-xl font-bold text-[var(--theme-foreground)]">
                        {format(new Date(selectedAnalista.dataAdmissao), "dd/MM/yyyy")}
                      </div>
                    </div>
                  </div>

                  {/* Avaliações */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[var(--theme-accent)]" />
                      Histórico de Avaliações
                    </h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {selectedAnalista.avaliacoes.map(avaliacao => (
                        <div 
                          key={avaliacao.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--theme-background-secondary)]"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[var(--theme-foreground)]">
                              {avaliacao.tipo.charAt(0).toUpperCase() + avaliacao.tipo.slice(1)}
                            </div>
                            <div className="text-[10px] text-[var(--theme-muted-foreground)]">
                              {format(avaliacao.data, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                            </div>
                            <p className="text-xs text-[var(--theme-muted-foreground)] mt-1">
                              {avaliacao.comentario}
                            </p>
                          </div>
                          <Badge 
                            variant={avaliacao.nota >= 8 ? 'default' : 'secondary'}
                            className="text-base font-bold px-3 ml-3"
                          >
                            {avaliacao.nota}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observações */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Observações</h4>
                    <p className="text-xs text-[var(--theme-muted-foreground)] p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      {selectedAnalista.observacoes}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}