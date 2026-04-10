import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Users, GraduationCap, BookOpen, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, TrendingDown, Star, Briefcase, Calendar, Brain,
  ArrowRight, Loader, BarChart3, Target, Award, Lightbulb,
  MessageSquare, FileText, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { toast } from 'sonner';

// Firebase services
import * as alunosService from '../../services/alunos-service';
import * as analistasService from '../../services/analistas-service';
import * as tarefasService from '../../services/tarefas-firebase-service';
import * as reunioesService from '../../services/reunioes-service';
import * as feedbacksService from '../../services/feedbacks-service';
import * as aulasService from '../../services/aulas-service';

// Mock data as fallback
import {
  mockAlunos, mockAnalistas, mockTarefas, mockReunioes,
  mockFeedbacks, mockAulas
} from '../../lib/mock-data';

interface DashboardData {
  totalAlunos: number;
  totalAnalistas: number;
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasEmProgresso: number;
  tarefasBacklog: number;
  totalReunioes: number;
  reunioesAgendadas: number;
  totalFeedbacks: number;
  totalAulas: number;
  alunoDestaque: { nome: string; media: number; foto?: string } | null;
  analistaDestaque: { nome: string; nota: number; foto?: string } | null;
  taxaConclusao: number;
  insightsIA: string[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user: firebaseUser, userProfile } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    totalAlunos: 0,
    totalAnalistas: 0,
    totalTarefas: 0,
    tarefasConcluidas: 0,
    tarefasEmProgresso: 0,
    tarefasBacklog: 0,
    totalReunioes: 0,
    reunioesAgendadas: 0,
    totalFeedbacks: 0,
    totalAulas: 0,
    alunoDestaque: null,
    analistaDestaque: null,
    taxaConclusao: 0,
    insightsIA: [],
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setIsLoading(true);

      let alunos: any[] = [];
      let analistas: any[] = [];
      let tarefasFiap: any[] = [];
      let tarefasItau: any[] = [];
      let reunioes: any[] = [];
      let feedbacks: any[] = [];
      let aulas: any[] = [];

      try { alunos = await alunosService.listarAlunos(); } catch { alunos = []; }
      try { analistas = await analistasService.listarAnalistas(); } catch { analistas = []; }
      try { tarefasFiap = await tarefasService.listTasksByContext('fiap'); } catch { tarefasFiap = []; }
      try { tarefasItau = await tarefasService.listTasksByContext('itau'); } catch { tarefasItau = []; }
      try { reunioes = await reunioesService.listarReunioes(); } catch { reunioes = []; }
      try { feedbacks = await feedbacksService.listarFeedbacks(); } catch { feedbacks = []; }
      try { aulas = await aulasService.listarAulas(); } catch { aulas = []; }

      if (alunos.length === 0) alunos = mockAlunos;
      if (analistas.length === 0) analistas = mockAnalistas;
      if (reunioes.length === 0) reunioes = mockReunioes;
      if (feedbacks.length === 0) feedbacks = mockFeedbacks;
      if (aulas.length === 0) aulas = mockAulas;

      const todasTarefas = [...tarefasFiap, ...tarefasItau];
      const tarefasFinal = todasTarefas.length > 0 ? todasTarefas : mockTarefas;

      const concluidas = tarefasFinal.filter((t: any) =>
        t.status === 'done' || t.status === 'concluido'
      ).length;
      const emProgresso = tarefasFinal.filter((t: any) =>
        t.status === 'doing' || t.status === 'em_progresso'
      ).length;
      const backlog = tarefasFinal.filter((t: any) =>
        t.status === 'backlog' || t.status === 'todo'
      ).length;
      const taxaConclusao = tarefasFinal.length > 0
        ? Math.round((concluidas / tarefasFinal.length) * 100) : 0;

      let alunoDestaque = null;
      if (alunos.length > 0) {
        const ranked = alunos.map((a: any) => {
          const notas = a.notas || [];
          const media = notas.length > 0
            ? notas.reduce((s: number, n: any) => s + (n.valor || 0), 0) / notas.length : 0;
          return { nome: a.nome, media: Math.round(media * 10) / 10, foto: a.foto };
        }).sort((a: any, b: any) => b.media - a.media);
        alunoDestaque = ranked[0] || null;
      }

      let analistaDestaque = null;
      if (analistas.length > 0) {
        const ranked = analistas.map((a: any) => {
          const avs = a.avaliacoes || [];
          const nota = avs.length > 0
            ? avs.reduce((s: number, av: any) => s + (av.nota || 0), 0) / avs.length : 0;
          return { nome: a.nome, nota: Math.round(nota * 10) / 10, foto: a.foto };
        }).sort((a: any, b: any) => b.nota - a.nota);
        analistaDestaque = ranked[0] || null;
      }

      const reunioesAgendadas = reunioes.filter((r: any) => r.status === 'agendada').length;

      const insights: string[] = [];
      if (taxaConclusao < 50) {
        insights.push(`A taxa de conclusão está em ${taxaConclusao}%. Considere priorizar as tarefas em backlog.`);
      } else {
        insights.push(`Excelente! Taxa de conclusão de ${taxaConclusao}%. Continue mantendo o ritmo.`);
      }
      if (emProgresso > concluidas) {
        insights.push(`Há ${emProgresso} tarefas em progresso. Foque em concluí-las antes de iniciar novas.`);
      }
      if (alunoDestaque && alunoDestaque.media >= 9) {
        insights.push(`${alunoDestaque.nome} está com média ${alunoDestaque.media}. Considere desafios extras.`);
      }
      if (reunioesAgendadas > 3) {
        insights.push(`${reunioesAgendadas} reuniões agendadas. Avalie se todas são necessárias.`);
      }
      if (backlog > 5) {
        insights.push(`${backlog} tarefas no backlog. Priorize e distribua entre a equipe.`);
      }
      if (analistas.length > 0 && feedbacks.length < analistas.length) {
        insights.push(`Apenas ${feedbacks.length} feedbacks para ${analistas.length} analistas. Dê mais feedbacks.`);
      }

      setData({
        totalAlunos: alunos.length,
        totalAnalistas: analistas.length,
        totalTarefas: tarefasFinal.length,
        tarefasConcluidas: concluidas,
        tarefasEmProgresso: emProgresso,
        tarefasBacklog: backlog,
        totalReunioes: reunioes.length,
        reunioesAgendadas,
        totalFeedbacks: feedbacks.length,
        totalAulas: aulas.length,
        alunoDestaque,
        analistaDestaque,
        taxaConclusao,
        insightsIA: insights,
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = userProfile?.nome || firebaseUser?.displayName || 'Usuário';
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader className="w-10 h-10 animate-spin text-[var(--theme-accent)] mx-auto" />
          <p className="text-[var(--theme-muted-foreground)]">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">
            {saudacao}, {displayName.split(' ')[0]}!
          </h1>
          <p className="text-[var(--theme-muted-foreground)] mt-1">
            Resumo das atividades em {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => navigate('/ai')}>
          <Brain className="w-4 h-4" />
          IA Assistant
        </Button>
      </div>

      {/* Big Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/fiap/alunos')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="secondary" className="text-xs">FIAP</Badge>
            </div>
            <div className="text-3xl font-bold text-[var(--theme-foreground)]">{data.totalAlunos}</div>
            <p className="text-sm text-[var(--theme-muted-foreground)] mt-1">Total de Alunos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/itau/analistas')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <Badge variant="secondary" className="text-xs">Itaú</Badge>
            </div>
            <div className="text-3xl font-bold text-[var(--theme-foreground)]">{data.totalAnalistas}</div>
            <p className="text-sm text-[var(--theme-muted-foreground)] mt-1">Total de Analistas</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(theme === 'fiap' ? '/fiap/kanban' : '/itau/kanban')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="outline" className="text-xs text-green-600">{data.taxaConclusao}%</Badge>
            </div>
            <div className="text-3xl font-bold text-[var(--theme-foreground)]">{data.tarefasConcluidas}/{data.totalTarefas}</div>
            <p className="text-sm text-[var(--theme-muted-foreground)] mt-1">Tarefas Concluídas</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/fiap/aulas')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="secondary" className="text-xs">Aulas</Badge>
            </div>
            <div className="text-3xl font-bold text-[var(--theme-foreground)]">{data.totalAulas}</div>
            <p className="text-sm text-[var(--theme-muted-foreground)] mt-1">Aulas Cadastradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{data.tarefasEmProgresso}</div>
                <p className="text-xs text-[var(--theme-muted-foreground)]">Em Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{data.tarefasBacklog}</div>
                <p className="text-xs text-[var(--theme-muted-foreground)]">No Backlog</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{data.reunioesAgendadas}</div>
                <p className="text-xs text-[var(--theme-muted-foreground)]">Reuniões Agendadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                <MessageSquare className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{data.totalFeedbacks}</div>
                <p className="text-xs text-[var(--theme-muted-foreground)]">Feedbacks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destaques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" /> Aluno Destaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.alunoDestaque ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden">
                  {data.alunoDestaque.foto ? (
                    <img src={data.alunoDestaque.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{data.alunoDestaque.nome}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600">Média {data.alunoDestaque.media}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--theme-muted-foreground)]">Nenhum aluno cadastrado</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" /> Analista Destaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.analistaDestaque ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center overflow-hidden">
                  {data.analistaDestaque.foto ? (
                    <img src={data.analistaDestaque.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{data.analistaDestaque.nome}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600">Nota {data.analistaDestaque.nota}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--theme-muted-foreground)]">Nenhum analista cadastrado</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" /> Produtividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{data.taxaConclusao}%</span>
                {data.taxaConclusao >= 50 ? (
                  <TrendingUp className="w-5 h-5 text-green-500 mb-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500 mb-1" />
                )}
              </div>
              <div className="w-full h-3 bg-[var(--theme-muted)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${data.taxaConclusao}%`,
                    backgroundColor: data.taxaConclusao >= 70 ? '#22c55e' : data.taxaConclusao >= 40 ? '#eab308' : '#ef4444'
                  }}
                />
              </div>
              <p className="text-xs text-[var(--theme-muted-foreground)]">
                {data.tarefasConcluidas} de {data.totalTarefas} tarefas concluídas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IA Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="w-5 h-5 text-[var(--theme-accent)]" />
            Recomendações da IA
            <Badge variant="outline" className="ml-2 text-xs">Baseado nos seus dados</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.insightsIA.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--theme-background-secondary)] border border-[var(--theme-border)]">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--theme-foreground)]">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Novo Aluno', desc: 'Cadastrar aluno', icon: Users, color: 'blue', path: '/fiap/alunos/novo' },
          { label: 'Novo Analista', desc: 'Cadastrar analista', icon: Briefcase, color: 'orange', path: '/itau/analistas/novo' },
          { label: 'Nova Aula', desc: 'Criar aula', icon: BookOpen, color: 'purple', path: '/fiap/aulas/nova' },
          { label: 'Nova Reunião', desc: 'Agendar reunião', icon: Calendar, color: 'indigo', path: '/itau/reunioes/nova' },
        ].map(item => (
          <Card key={item.path} className="cursor-pointer hover:shadow-lg transition-all hover:border-[var(--theme-accent)]" onClick={() => navigate(item.path)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30`}>
                <item.icon className={`w-4 h-4 text-${item.color}-600`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-[var(--theme-muted-foreground)]">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--theme-muted-foreground)]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Distribuição de Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Backlog', count: data.tarefasBacklog, color: 'bg-gray-400' },
                { label: 'Em Progresso', count: data.tarefasEmProgresso, color: 'bg-yellow-500' },
                { label: 'Concluídas', count: data.tarefasConcluidas, color: 'bg-green-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" /> Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: `${data.tarefasConcluidas} tarefas concluídas`, color: 'bg-green-500' },
                { label: `${data.totalAulas} aulas registradas`, color: 'bg-blue-500' },
                { label: `${data.totalFeedbacks} feedbacks dados`, color: 'bg-orange-500' },
                { label: `${data.totalReunioes} reuniões realizadas`, color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" /> Resumo Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--theme-muted-foreground)]">Contexto FIAP</span>
                <span className="font-medium">{data.totalAlunos} alunos, {data.totalAulas} aulas</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--theme-muted-foreground)]">Contexto Itaú</span>
                <span className="font-medium">{data.totalAnalistas} analistas</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--theme-muted-foreground)]">Produtividade</span>
                <Badge variant={data.taxaConclusao >= 70 ? 'default' : 'destructive'} className="text-xs">
                  {data.taxaConclusao >= 70 ? 'Ótima' : data.taxaConclusao >= 40 ? 'Regular' : 'Baixa'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
