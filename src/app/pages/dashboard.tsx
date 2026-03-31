import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Award,
  Target,
  Zap,
  Clock,
  BarChart3,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockEventos, mockEficienciaScore, mockTarefas, mockAlunos, mockAnalistas, mockReunioes, mockAulas } from '../../lib/mock-data';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../../lib/cn';
import { useTheme } from '../../lib/theme-context';

export function Dashboard() {
  const { theme } = useTheme();
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { locale: ptBR });
  const fimSemana = endOfWeek(hoje, { locale: ptBR });
  
  const eventosHoje = mockEventos.filter(e => 
    format(e.data, 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd')
  );
  
  const eventosSemana = mockEventos.filter(e =>
    isWithinInterval(e.data, { start: inicioSemana, end: fimSemana })
  );
  
  const tarefasUrgentes = mockTarefas.filter(t => 
    t.prioridade === 'alta' || t.prioridade === 'critica'
  );

  const tarefasConcluidas = mockTarefas.filter(t => t.status === 'done').length;
  const tarefasPendentes = mockTarefas.filter(t => t.status !== 'done').length;
  const taxaConclusao = Math.round((tarefasConcluidas / mockTarefas.length) * 100);

  const reunioesSemana = mockReunioes.filter(r =>
    isWithinInterval(r.data, { start: inicioSemana, end: fimSemana })
  ).length;

  const aulasSemana = mockAulas.filter(a =>
    isWithinInterval(a.data, { start: inicioSemana, end: fimSemana })
  ).length;

  const chartData = mockEficienciaScore.historico.map(h => ({
    data: format(h.data, 'dd/MM'),
    score: h.score,
  }));

  // Dados para gráfico de tarefas por contexto
  const tarefasPorContexto = [
    { name: 'FIAP', value: mockTarefas.filter(t => t.contexto === 'fiap').length, color: '#6A0DAD' },
    { name: 'Itaú', value: mockTarefas.filter(t => t.contexto === 'itau').length, color: '#EC7000' },
  ];

  // Dados para gráfico de produtividade semanal
  const produtividadeSemanal = mockEficienciaScore.historico.slice(-7).map(h => ({
    dia: format(h.data, 'EEE', { locale: ptBR }),
    tarefas: h.tarefasConcluidas,
    reunioes: h.reunioesRealizadas,
    aulas: h.aulasMinistradas,
  }));

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--theme-foreground)]">
          Dashboard Executivo
        </h1>
        <p className="text-xs text-[var(--theme-muted-foreground)] mt-0.5">
          {format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className={cn(theme === 'fiap' && 'border-l-4 border-l-[var(--theme-accent)]')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--theme-muted-foreground)] mb-1">Score Geral</p>
                <p className="text-2xl font-bold text-[var(--theme-foreground)]">
                  {mockEficienciaScore.valor}
                </p>
                <p className="text-[10px] text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% vs semana passada
                </p>
              </div>
              <div className="p-2.5 rounded-full bg-[var(--theme-accent)]/10">
                <Target className="w-5 h-5 text-[var(--theme-accent)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--theme-muted-foreground)] mb-1">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-[var(--theme-foreground)]">
                  {taxaConclusao}%
                </p>
                <p className="text-[10px] text-[var(--theme-muted-foreground)] mt-1">
                  {tarefasConcluidas} de {mockTarefas.length} tarefas
                </p>
              </div>
              <div className="p-2.5 rounded-full bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--theme-muted-foreground)] mb-1">Eventos Semana</p>
                <p className="text-2xl font-bold text-[var(--theme-foreground)]">
                  {eventosSemana.length}
                </p>
                <p className="text-[10px] text-[var(--theme-muted-foreground)] mt-1">
                  {aulasSemana} aulas • {reunioesSemana} reuniões
                </p>
              </div>
              <div className="p-2.5 rounded-full bg-blue-500/10">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--theme-muted-foreground)] mb-1">Tarefas Urgentes</p>
                <p className="text-2xl font-bold text-[var(--theme-foreground)]">
                  {tarefasUrgentes.length}
                </p>
                <p className="text-[10px] text-orange-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  Requerem atenção
                </p>
              </div>
              <div className="p-2.5 rounded-full bg-orange-500/10">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Score de Eficiência */}
        <Card className={cn(theme === 'fiap' && 'glow-effect')}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4 text-[var(--theme-accent)]" />
              Evolução de Eficiência
            </CardTitle>
            <CardDescription className="text-xs">Últimos 7 dias de produtividade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" opacity={0.3} />
                  <XAxis 
                    dataKey="data" 
                    stroke="var(--theme-muted-foreground)"
                    style={{ fontSize: '11px' }}
                    tickLine={false}
                  />
                  <YAxis 
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
                    dataKey="score" 
                    stroke="var(--theme-accent)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--theme-accent)', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Produtividade Semanal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4 text-[var(--theme-accent)]" />
              Produtividade Semanal
            </CardTitle>
            <CardDescription className="text-xs">Distribuição de atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={produtividadeSemanal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" opacity={0.3} />
                  <XAxis 
                    dataKey="dia" 
                    stroke="var(--theme-muted-foreground)"
                    style={{ fontSize: '11px' }}
                    tickLine={false}
                  />
                  <YAxis 
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
                  <Bar dataKey="tarefas" fill="#10b981" name="Tarefas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reunioes" fill="#3b82f6" name="Reuniões" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="aulas" fill="#f59e0b" name="Aulas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalhadas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4 text-[var(--theme-accent)]" />
            Métricas Detalhadas
          </CardTitle>
          <CardDescription className="text-xs">Resumo completo de atividades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1.5 text-green-500" />
              <div className="text-xl font-bold text-[var(--theme-foreground)]">
                {mockEficienciaScore.historico[mockEficienciaScore.historico.length - 1].tarefasConcluidas}
              </div>
              <div className="text-[10px] text-[var(--theme-muted-foreground)]">Tarefas Hoje</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
              <Users className="w-4 h-4 mx-auto mb-1.5 text-blue-500" />
              <div className="text-xl font-bold text-[var(--theme-foreground)]">
                {mockEficienciaScore.historico[mockEficienciaScore.historico.length - 1].reunioesRealizadas}
              </div>
              <div className="text-[10px] text-[var(--theme-muted-foreground)]">Reuniões Hoje</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
              <MessageSquare className="w-4 h-4 mx-auto mb-1.5 text-purple-500" />
              <div className="text-xl font-bold text-[var(--theme-foreground)]">
                {mockEficienciaScore.historico[mockEficienciaScore.historico.length - 1].feedbacksFeitos}
              </div>
              <div className="text-[10px] text-[var(--theme-muted-foreground)]">Feedbacks Hoje</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
              <BookOpen className="w-4 h-4 mx-auto mb-1.5 text-orange-500" />
              <div className="text-xl font-bold text-[var(--theme-foreground)]">
                {mockEficienciaScore.historico[mockEficienciaScore.historico.length - 1].aulasMinistradas}
              </div>
              <div className="text-[10px] text-[var(--theme-muted-foreground)]">Aulas Hoje</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
              <Users className="w-4 h-4 mx-auto mb-1.5 text-indigo-500" />
              <div className="text-xl font-bold text-[var(--theme-foreground)]">
                {mockAlunos.length}
              </div>
              <div className="text-[10px] text-[var(--theme-muted-foreground)]">Alunos Ativos</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--theme-background-secondary)]">
              <Users className="w-4 h-4 mx-auto mb-1.5 text-cyan-500" />
              <div className="text-xl font-bold text-[var(--theme-foreground)]">
                {mockAnalistas.length}
              </div>
              <div className="text-[10px] text-[var(--theme-muted-foreground)]">Analistas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Agenda do Dia */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="w-4 h-4 text-[var(--theme-accent)]" />
              Agenda de Hoje
            </CardTitle>
            <CardDescription className="text-xs">{eventosHoje.length} eventos agendados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {eventosHoje.map(evento => (
                <div 
                  key={evento.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--theme-background-secondary)] hover:bg-[var(--theme-hover)] transition-colors"
                >
                  <div className="text-center min-w-[50px]">
                    <div className="text-xs font-medium text-[var(--theme-foreground)]">
                      {format(evento.data, 'HH:mm')}
                    </div>
                    <div className="text-[10px] text-[var(--theme-muted-foreground)]">
                      {evento.duracao}min
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[var(--theme-foreground)] mb-1">
                      {evento.titulo}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge 
                        variant={evento.tipo === 'aula' ? 'theme' : 'secondary'}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {evento.tipo}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-[10px] px-1.5 py-0"
                        style={{
                          borderColor: evento.contexto === 'fiap' ? '#6A0DAD' : '#EC7000',
                          color: evento.contexto === 'fiap' ? '#6A0DAD' : '#EC7000'
                        }}
                      >
                        {evento.contexto.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas Urgentes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="w-4 h-4 text-[var(--theme-accent)]" />
              Tarefas Urgentes
            </CardTitle>
            <CardDescription className="text-xs">{tarefasUrgentes.length} requerem atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tarefasUrgentes.slice(0, 4).map(tarefa => (
                <div 
                  key={tarefa.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[var(--theme-background-secondary)] hover:bg-[var(--theme-hover)] transition-colors"
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                    tarefa.prioridade === 'critica' && "bg-red-500",
                    tarefa.prioridade === 'alta' && "bg-orange-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--theme-foreground)] mb-1">
                      {tarefa.titulo}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={tarefa.status === 'doing' ? 'theme' : 'secondary'} className="text-[10px] px-1.5 py-0">
                        {tarefa.status}
                      </Badge>
                      <span className="text-[10px] text-[var(--theme-muted-foreground)]">
                        {tarefa.contexto === 'fiap' ? 'FIAP' : 'Itaú'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights de IA */}
      <Card className={cn(theme === 'fiap' && 'border-[var(--theme-accent)]')}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="w-4 h-4 text-[var(--theme-accent)]" />
            Insights & Recomendações
          </CardTitle>
          <CardDescription className="text-xs">Sugestões geradas por IA para melhorar sua produtividade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockEficienciaScore.insights.map(insight => (
              <div 
                key={insight.id}
                className={cn(
                  "flex items-start gap-2.5 p-3 rounded-lg",
                  insight.tipo === 'alerta' && "bg-orange-500/10 border border-orange-500/20",
                  insight.tipo === 'sugestao' && "bg-blue-500/10 border border-blue-500/20",
                  insight.tipo === 'elogio' && "bg-green-500/10 border border-green-500/20"
                )}
              >
                {insight.tipo === 'alerta' && <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />}
                {insight.tipo === 'sugestao' && <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                {insight.tipo === 'elogio' && <Award className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-xs text-[var(--theme-foreground)]">{insight.mensagem}</p>
                  <p className="text-[10px] text-[var(--theme-muted-foreground)] mt-1">
                    {format(insight.data, "d 'de' MMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}