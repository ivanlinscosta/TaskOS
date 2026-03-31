import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Mail, BookOpen, TrendingUp, Award, Pencil, Phone, Calendar, GraduationCap, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { mockAlunos } from '../../../lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../../lib/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Alunos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAluno, setSelectedAluno] = useState(mockAlunos[0]);

  const filteredAlunos = mockAlunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.curso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularMedia = (aluno: typeof mockAlunos[0]) => {
    if (aluno.notas.length === 0) return 0;
    const soma = aluno.notas.reduce((acc, nota) => acc + nota.valor, 0);
    return (soma / aluno.notas.length).toFixed(1);
  };

  const calcularPresenca = (aluno: typeof mockAlunos[0]) => {
    // Mock: calcular presença baseado no ID
    return 85 + (parseInt(aluno.id) % 15);
  };

  const chartData = selectedAluno.notas.map(nota => ({
    disciplina: nota.disciplina.substring(0, 10),
    nota: nota.valor,
  }));

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--theme-foreground)]">Gestão de Alunos</h1>
          <p className="text-xs text-[var(--theme-muted-foreground)] mt-0.5">
            {filteredAlunos.length} alunos cadastrados
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
                          <AvatarFallback>{aluno.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}</AvatarFallback>
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
                            {aluno.notas.length}
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

              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-[var(--theme-accent)]">
                        <AvatarImage src={selectedAluno.foto} />
                        <AvatarFallback>
                          {selectedAluno.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xl">{selectedAluno.nome}</div>
                        <div className="text-sm font-normal text-[var(--theme-muted-foreground)]">
                          {selectedAluno.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="theme"
                      size="sm"
                      onClick={() => navigate(`/fiap/alunos/${selectedAluno.id}/avaliacao`)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nova Avaliação
                    </Button>
                  </DialogTitle>
                  <DialogDescription>{selectedAluno.curso}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Métricas Gerais */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                      <div className="text-2xl font-bold text-[var(--theme-foreground)]">
                        {calcularMedia(selectedAluno)}
                      </div>
                      <div className="text-xs text-[var(--theme-muted-foreground)]">Média Geral</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <div className="text-2xl font-bold text-[var(--theme-foreground)]">
                        {calcularPresenca(selectedAluno)}%
                      </div>
                      <div className="text-xs text-[var(--theme-muted-foreground)]">Presença</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      <BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <div className="text-2xl font-bold text-[var(--theme-foreground)]">
                        {selectedAluno.notas.length}
                      </div>
                      <div className="text-xs text-[var(--theme-muted-foreground)]">Avaliações</div>
                    </div>
                  </div>

                  {/* Desempenho */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[var(--theme-accent)]" />
                      Desempenho Acadêmico
                    </h4>
                    <div className="h-[200px] bg-[var(--theme-background-secondary)] rounded-lg p-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" opacity={0.3} />
                          <XAxis 
                            dataKey="disciplina" 
                            stroke="var(--theme-muted-foreground)"
                            style={{ fontSize: '11px' }}
                            tickLine={false}
                          />
                          <YAxis 
                            domain={[0, 10]}
                            stroke="var(--theme-muted-foreground)"
                            style={{ fontSize: '11px' }}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'var(--theme-card)',
                              border: '1px solid var(--theme-border)',
                              borderRadius: '6px',
                              color: 'var(--theme-foreground)',
                              fontSize: '12px',
                              padding: '8px 12px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="nota" 
                            stroke="var(--theme-accent)" 
                            strokeWidth={2}
                            dot={{ fill: 'var(--theme-accent)', r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Notas */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Histórico de Notas</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {selectedAluno.notas.map(nota => (
                        <div 
                          key={nota.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--theme-background-secondary)]"
                        >
                          <div>
                            <div className="text-sm font-medium text-[var(--theme-foreground)]">
                              {nota.disciplina}
                            </div>
                            <div className="text-[10px] text-[var(--theme-muted-foreground)]">
                              {nota.tipo} • {format(new Date(nota.data), "d 'de' MMM", { locale: ptBR })}
                            </div>
                          </div>
                          <Badge 
                            variant={nota.valor >= 7 ? 'default' : 'destructive'}
                            className="text-base font-bold px-3"
                          >
                            {nota.valor}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observações */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Observações</h4>
                    <p className="text-xs text-[var(--theme-muted-foreground)] p-3 rounded-lg bg-[var(--theme-background-secondary)]">
                      {selectedAluno.observacoes}
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