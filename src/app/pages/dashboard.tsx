import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Star,
  Calendar,
  Brain,
  ArrowRight,
  Loader,
  BarChart3,
  Target,
  Award,
  Lightbulb,
  MessageSquare,
  FileText,
  Zap,
  ClipboardList,
  Users,
  RefreshCw,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../../lib/auth-context';
import { useAppStore } from '../../stores/useAppStore';
import { askAssistant } from '../../services/ai-assistant-service';
import { toast } from 'sonner';

import * as alunosService from '../../services/alunos-service';
import * as analistasService from '../../services/analistas-service';
import * as tarefasService from '../../services/tarefas-firebase-service';
import * as reunioesService from '../../services/reunioes-service';
import * as feedbacksService from '../../services/feedbacks-service';
import * as aulasService from '../../services/aulas-service';

interface DashboardData {
  totalAlunos: number;
  totalAnalistas: number;
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasEmProgresso: number;
  tarefasBacklog: number;
  tarefasAtrasadas: number;
  totalReunioes: number;
  reunioesAgendadas: number;
  totalFeedbacks: number;
  totalAulas: number;
  totalAvaliacoesAlunos: number;
  totalMateriaisAulas: number;
  totalEventosCronograma: number;
  mediaGeralAlunos: number;
  alunosEmAtencao: number;
  analistasSemFeedback: number;
  coberturaFeedback: number;
  alunoDestaque: { nome: string; media: number; foto?: string } | null;
  analistaDestaque: { nome: string; nota: number; foto?: string } | null;
  taxaConclusao: number;
  insightsIA: string[];
  recomendacaoMarkdown: string;
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate();

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getTaskStatus(task: any): string {
  return String(task?.status || '').toLowerCase().trim();
}

function isTaskDone(task: any): boolean {
  const status = getTaskStatus(task);
  return ['done', 'concluido', 'concluída', 'completed', 'finalizado'].includes(status);
}

function isTaskDoing(task: any): boolean {
  const status = getTaskStatus(task);
  return ['doing', 'in_progress', 'em_progresso', 'em andamento', 'andamento'].includes(
    status
  );
}

function isTaskBacklog(task: any): boolean {
  const status = getTaskStatus(task);
  return ['backlog', 'todo', 'to_do', 'pendente', 'a fazer'].includes(status);
}

function isTaskOverdue(task: any): boolean {
  const dueDate =
    normalizeDate(task?.dataEntrega) ||
    normalizeDate(task?.prazo) ||
    normalizeDate(task?.dueDate);

  if (!dueDate) return false;
  return dueDate.getTime() < new Date().getTime() && !isTaskDone(task);
}

function extractAlunoMedia(aluno: any): number {
  const avaliacoes = safeArray<any>(aluno?.avaliacoes);
  const notas = safeArray<any>(aluno?.notas);
  const itens = avaliacoes.length ? avaliacoes : notas;

  if (!itens.length) return 0;

  const valores = itens
    .map((item) => Number(item?.nota ?? item?.valor ?? 0))
    .filter((value) => !Number.isNaN(value));

  if (!valores.length) return 0;

  return valores.reduce((acc, value) => acc + value, 0) / valores.length;
}

function extractAnalistaNota(analista: any): number {
  const avaliacoes = safeArray<any>(analista?.avaliacoes);
  if (!avaliacoes.length) return 0;

  const conceitosMap: Record<string, number> = {
    'destaca-se': 10,
    alinhado: 7.5,
    'abaixo do esperado': 4,
  };

  const valores = avaliacoes
    .map((av) => {
      const nota = Number(av?.nota);
      if (!Number.isNaN(nota) && nota > 0) return nota;

      const conceito = String(av?.conceito || '').toLowerCase().trim();
      return conceitosMap[conceito] ?? 0;
    })
    .filter((n) => !Number.isNaN(n));

  if (!valores.length) return 0;

  return valores.reduce((acc, n) => acc + n, 0) / valores.length;
}

function countAulaNestedItems(aulas: any[], keys: string[]): number {
  return aulas.reduce((acc, aula) => {
    const count = keys.reduce((inner, key) => inner + safeArray<any>(aula?.[key]).length, 0);
    return acc + count;
  }, 0);
}

function buildInsightsFromMarkdown(markdown: string): string[] {
  return markdown
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').replace(/^##\s*/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, 4);
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user: firebaseUser, userProfile } = useAuth();
  const { contextMode } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingInsights, setIsUpdatingInsights] = useState(false);

  const [data, setData] = useState<DashboardData>({
    totalAlunos: 0,
    totalAnalistas: 0,
    totalTarefas: 0,
    tarefasConcluidas: 0,
    tarefasEmProgresso: 0,
    tarefasBacklog: 0,
    tarefasAtrasadas: 0,
    totalReunioes: 0,
    reunioesAgendadas: 0,
    totalFeedbacks: 0,
    totalAulas: 0,
    totalAvaliacoesAlunos: 0,
    totalMateriaisAulas: 0,
    totalEventosCronograma: 0,
    mediaGeralAlunos: 0,
    alunosEmAtencao: 0,
    analistasSemFeedback: 0,
    coberturaFeedback: 0,
    alunoDestaque: null,
    analistaDestaque: null,
    taxaConclusao: 0,
    insightsIA: [],
    recomendacaoMarkdown: '',
  });

  useEffect(() => {
    void carregarDados();
  }, [contextMode]);

  const carregarDados = async () => {
    try {
      setIsLoading(true);

      let alunos: any[] = [];
      let analistas: any[] = [];
      let tarefas: any[] = [];
      let reunioes: any[] = [];
      let feedbacks: any[] = [];
      let aulas: any[] = [];

      if (contextMode === 'fiap') {
        try {
          alunos = await alunosService.listarAlunos();
        } catch {
          alunos = [];
        }

        try {
          aulas = await aulasService.listarAulas();
        } catch {
          aulas = [];
        }

        try {
          tarefas = await tarefasService.listTasksByContext('fiap');
        } catch {
          tarefas = [];
        }
      }

      if (contextMode === 'itau') {
        try {
          analistas = await analistasService.listarAnalistas();
        } catch {
          analistas = [];
        }

        try {
          tarefas = await tarefasService.listTasksByContext('itau');
        } catch {
          tarefas = [];
        }

        try {
          reunioes = await reunioesService.listarReunioes();
        } catch {
          reunioes = [];
        }

        try {
          feedbacks = await feedbacksService.listarFeedbacks();
        } catch {
          feedbacks = [];
        }
      }

      const tarefasConcluidas = tarefas.filter(isTaskDone).length;
      const tarefasEmProgresso = tarefas.filter(isTaskDoing).length;
      const tarefasBacklog = tarefas.filter(isTaskBacklog).length;
      const tarefasAtrasadas = tarefas.filter(isTaskOverdue).length;
      const taxaConclusao =
        tarefas.length > 0 ? Math.round((tarefasConcluidas / tarefas.length) * 100) : 0;

      let alunoDestaque: DashboardData['alunoDestaque'] = null;
      let analistaDestaque: DashboardData['analistaDestaque'] = null;
      let mediaGeralAlunos = 0;
      let alunosEmAtencao = 0;
      let analistasSemFeedback = 0;
      let coberturaFeedback = 0;

      if (alunos.length > 0) {
        const ranked = alunos
          .map((aluno) => ({
            nome: aluno?.nome || 'Aluno',
            media: Number(extractAlunoMedia(aluno).toFixed(1)),
            foto: aluno?.foto,
          }))
          .sort((a, b) => b.media - a.media);

        alunoDestaque = ranked[0] || null;
        mediaGeralAlunos =
          ranked.reduce((acc, item) => acc + item.media, 0) / Math.max(ranked.length, 1);
        alunosEmAtencao = ranked.filter((item) => item.media > 0 && item.media < 6).length;
      }

      if (analistas.length > 0) {
        const ranked = analistas
          .map((analista) => ({
            nome: analista?.nome || 'Analista',
            nota: Number(extractAnalistaNota(analista).toFixed(1)),
            foto: analista?.foto,
            feedbacks: safeArray<any>(analista?.feedbacks).length,
          }))
          .sort((a, b) => b.nota - a.nota);

        analistaDestaque = ranked[0] || null;
        analistasSemFeedback = ranked.filter((item) => item.feedbacks === 0).length;
        coberturaFeedback =
          analistas.length > 0
            ? Math.round(((analistas.length - analistasSemFeedback) / analistas.length) * 100)
            : 0;
      }

      const reunioesAgendadas = reunioes.filter((r) =>
        ['agendada', 'scheduled'].includes(String(r?.status || '').toLowerCase())
      ).length;

      const totalAvaliacoesAlunos = alunos.reduce((acc, aluno) => {
        const avaliacoes = safeArray<any>(aluno?.avaliacoes);
        const notas = safeArray<any>(aluno?.notas);
        return acc + (avaliacoes.length || notas.length);
      }, 0);

      const totalMateriaisAulas = countAulaNestedItems(aulas, ['materiais']);
      const totalEventosCronograma = aulas.reduce((acc, aula) => {
        const atividades = safeArray<any>(aula?.atividades).length;
        const avaliacoes = safeArray<any>(aula?.avaliacoes).length;
        return acc + atividades + avaliacoes;
      }, 0);

      setData((prev) => ({
        ...prev,
        totalAlunos: alunos.length,
        totalAnalistas: analistas.length,
        totalTarefas: tarefas.length,
        tarefasConcluidas,
        tarefasEmProgresso,
        tarefasBacklog,
        tarefasAtrasadas,
        totalReunioes: reunioes.length,
        reunioesAgendadas,
        totalFeedbacks: feedbacks.length,
        totalAulas: aulas.length,
        totalAvaliacoesAlunos,
        totalMateriaisAulas,
        totalEventosCronograma,
        mediaGeralAlunos: Number(mediaGeralAlunos.toFixed(1)),
        alunosEmAtencao,
        analistasSemFeedback,
        coberturaFeedback,
        alunoDestaque,
        analistaDestaque,
        taxaConclusao,
      }));
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Não foi possível carregar o dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarInsightsIA = async () => {
    try {
      setIsUpdatingInsights(true);

      const resumoParaIA =
        contextMode === 'fiap'
          ? `
Você é um analista pedagógico sênior do TaskOS no contexto FIAP.

Analise os dados do dashboard e gere recomendações curtas, claras e úteis.
Não escreva textos longos.
Seja objetivo, executivo e orientado à ação.

Metas:
- melhorar desempenho acadêmico
- identificar alunos em atenção
- equilibrar o cronograma
- melhorar consistência entre aulas, avaliações e materiais
- sugerir ações práticas para a próxima semana

Dados:
- total de alunos: ${data.totalAlunos}
- total de aulas: ${data.totalAulas}
- média geral dos alunos: ${data.mediaGeralAlunos}
- alunos em atenção: ${data.alunosEmAtencao}
- avaliações lançadas: ${data.totalAvaliacoesAlunos}
- materiais cadastrados: ${data.totalMateriaisAulas}
- eventos do cronograma: ${data.totalEventosCronograma}
- tarefas totais: ${data.totalTarefas}
- tarefas concluídas: ${data.tarefasConcluidas}
- tarefas em progresso: ${data.tarefasEmProgresso}
- tarefas backlog: ${data.tarefasBacklog}
- tarefas atrasadas: ${data.tarefasAtrasadas}
- aluno destaque: ${data.alunoDestaque?.nome || 'nenhum'} com média ${data.alunoDestaque?.media || 0}

Retorne markdown com esta estrutura exata:

## Resumo executivo
No máximo 2 frases curtas.

## Prioridades da semana
- item curto
- item curto
- item curto

## Ações práticas
- ação curta
- ação curta
- ação curta

## Risco principal
1 frase curta.

## Oportunidade principal
1 frase curta.

Cada bullet deve ter no máximo 16 palavras.
`
          : `
Você é um gerente sênior de performance e people management do TaskOS no contexto Itaú.

Analise os dados do dashboard e gere recomendações curtas, claras e úteis.
Não escreva textos longos.
Seja objetivo, executivo e orientado à ação.

Metas:
- aumentar cobertura de feedback
- reduzir analistas sem acompanhamento
- melhorar produtividade do time
- reduzir backlog e tarefas atrasadas
- organizar a cadência de gestão
- sugerir ações práticas para a próxima semana

Dados:
- total de analistas: ${data.totalAnalistas}
- total de feedbacks: ${data.totalFeedbacks}
- reuniões agendadas: ${data.reunioesAgendadas}
- tarefas totais: ${data.totalTarefas}
- tarefas concluídas: ${data.tarefasConcluidas}
- tarefas em progresso: ${data.tarefasEmProgresso}
- tarefas backlog: ${data.tarefasBacklog}
- tarefas atrasadas: ${data.tarefasAtrasadas}
- cobertura de feedback: ${data.coberturaFeedback}%
- analistas sem feedback: ${data.analistasSemFeedback}
- analista destaque: ${data.analistaDestaque?.nome || 'nenhum'} com nota ${data.analistaDestaque?.nota || 0}

Retorne markdown com esta estrutura exata:

## Resumo executivo
No máximo 2 frases curtas.

## Prioridades da semana
- item curto
- item curto
- item curto

## Ações práticas
- ação curta
- ação curta
- ação curta

## Risco principal
1 frase curta.

## Oportunidade principal
1 frase curta.

Cada bullet deve ter no máximo 16 palavras.
`;

      const aiResponse = await askAssistant({
        prompt: resumoParaIA,
        contextMode,
        history: [],
      });

      setData((prev) => ({
        ...prev,
        recomendacaoMarkdown: aiResponse.markdown,
        insightsIA: buildInsightsFromMarkdown(aiResponse.markdown),
      }));

      toast.success('Insights atualizados com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar insights da IA:', error);
      toast.error('Não foi possível atualizar os insights da IA.');
    } finally {
      setIsUpdatingInsights(false);
    }
  };

  const displayName = userProfile?.nome || firebaseUser?.displayName || 'Usuário';
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  const kpis = useMemo(() => {
    if (contextMode === 'fiap') {
      return [
        {
          title: 'Total de Alunos',
          value: data.totalAlunos,
          subtitle: 'Alunos cadastrados',
          icon: GraduationCap,
          accent: 'bg-blue-100 text-blue-600',
          path: '/fiap/alunos',
        },
        {
          title: 'Aulas',
          value: data.totalAulas,
          subtitle: 'Aulas cadastradas',
          icon: BookOpen,
          accent: 'bg-purple-100 text-purple-600',
          path: '/fiap/aulas',
        },
        {
          title: 'Média Geral',
          value: data.mediaGeralAlunos,
          subtitle: 'Desempenho geral',
          icon: Star,
          accent: 'bg-yellow-100 text-yellow-600',
          path: '/fiap/alunos',
        },
        {
          title: 'Eventos do Cronograma',
          value: data.totalEventosCronograma,
          subtitle: 'Atividades + avaliações',
          icon: Calendar,
          accent: 'bg-indigo-100 text-indigo-600',
          path: '/fiap/cronograma',
        },
      ];
    }

    return [
      {
        title: 'Total de Analistas',
        value: data.totalAnalistas,
        subtitle: 'Analistas cadastrados',
        icon: Briefcase,
        accent: 'bg-orange-100 text-orange-600',
        path: '/itau/analistas',
      },
      {
        title: 'Feedbacks',
        value: data.totalFeedbacks,
        subtitle: 'Feedbacks registrados',
        icon: MessageSquare,
        accent: 'bg-pink-100 text-pink-600',
        path: '/itau/feedbacks',
      },
      {
        title: 'Cobertura de Feedback',
        value: `${data.coberturaFeedback}%`,
        subtitle: 'Analistas acompanhados',
        icon: CheckCircle2,
        accent: 'bg-green-100 text-green-600',
        path: '/itau/feedbacks',
      },
      {
        title: 'Reuniões Agendadas',
        value: data.reunioesAgendadas,
        subtitle: 'Agenda do time',
        icon: Calendar,
        accent: 'bg-indigo-100 text-indigo-600',
        path: '/itau/reunioes',
      },
    ];
  }, [contextMode, data]);

  const miniKpis = useMemo(() => {
    if (contextMode === 'fiap') {
      return [
        {
          label: 'Alunos em atenção',
          value: data.alunosEmAtencao,
          icon: AlertTriangle,
          accent: 'bg-red-100 text-red-600',
        },
        {
          label: 'Avaliações lançadas',
          value: data.totalAvaliacoesAlunos,
          icon: ClipboardList,
          accent: 'bg-violet-100 text-violet-600',
        },
        {
          label: 'Materiais nas aulas',
          value: data.totalMateriaisAulas,
          icon: FileText,
          accent: 'bg-cyan-100 text-cyan-600',
        },
        {
          label: 'Tarefas concluídas',
          value: `${data.tarefasConcluidas}/${data.totalTarefas}`,
          icon: CheckCircle2,
          accent: 'bg-green-100 text-green-600',
        },
      ];
    }

    return [
      {
        label: 'Em progresso',
        value: data.tarefasEmProgresso,
        icon: Clock,
        accent: 'bg-yellow-100 text-yellow-600',
      },
      {
        label: 'No backlog',
        value: data.tarefasBacklog,
        icon: AlertTriangle,
        accent: 'bg-red-100 text-red-600',
      },
      {
        label: 'Tarefas atrasadas',
        value: data.tarefasAtrasadas,
        icon: Target,
        accent: 'bg-rose-100 text-rose-600',
      },
      {
        label: 'Sem feedback',
        value: data.analistasSemFeedback,
        icon: Users,
        accent: 'bg-slate-100 text-slate-600',
      },
    ];
  }, [contextMode, data]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader className="mx-auto h-10 w-10 animate-spin text-[var(--theme-accent)]" />
          <p className="text-[var(--theme-muted-foreground)]">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-foreground)]">
            {saudacao}, {displayName.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-[var(--theme-muted-foreground)]">
            {contextMode === 'fiap'
              ? 'Resumo acadêmico do ambiente FIAP'
              : 'Resumo gerencial do ambiente Itaú'}{' '}
            em{' '}
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>

        <Button variant="outline" className="gap-2" onClick={() => navigate('/ai')}>
          <Brain className="h-4 w-4" />
          IA Assistant
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((item) => (
          <Card
            key={item.title}
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => navigate(item.path)}
          >
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-lg p-2 ${item.accent}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {contextMode === 'fiap' ? 'FIAP' : 'Itaú'}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-[var(--theme-foreground)]">
                {item.value}
              </div>
              <p className="mt-1 text-sm text-[var(--theme-muted-foreground)]">
                {item.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {miniKpis.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${item.accent}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-bold">{item.value}</div>
                  <p className="text-xs text-[var(--theme-muted-foreground)]">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-5 w-5 text-[var(--theme-accent)]" />
              Recomendações da IA
              <Badge variant="outline" className="ml-2 text-xs">
                Sob demanda
              </Badge>
            </CardTitle>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => void atualizarInsightsIA()}
              disabled={isUpdatingInsights}
            >
              {isUpdatingInsights ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Atualizar insights
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {data.recomendacaoMarkdown ? (
            <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-background-secondary)]">
              <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
                <div className="border-b border-[var(--theme-border)] p-4 md:border-b-0 md:border-r">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-foreground)]">
                    Resumo e foco
                  </p>
                  <div className="dashboard-ai-markdown prose prose-sm max-w-none text-[13px] leading-6 text-[var(--theme-foreground)]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {data.recomendacaoMarkdown.split('## Ações práticas')[0].trim()}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-foreground)]">
                    Ações recomendadas
                  </p>
                  <div className="dashboard-ai-markdown prose prose-sm max-w-none text-[13px] leading-6 text-[var(--theme-foreground)]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {`## Ações práticas${data.recomendacaoMarkdown.split('## Ações práticas')[1] || ''}`}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-background-secondary)] p-6 text-center">
              <Brain className="mx-auto mb-3 h-8 w-8 text-[var(--theme-accent)]" />
              <p className="text-sm font-medium text-[var(--theme-foreground)]">
                Insights da IA ainda não gerados
              </p>
              <p className="mt-1 text-sm text-[var(--theme-muted-foreground)]">
                Clique em <strong>Atualizar insights</strong> para gerar recomendações com base
                nos dados atuais do dashboard.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        .dashboard-ai-markdown h2 {
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          line-height: 1.3rem;
          font-weight: 700;
        }

        .dashboard-ai-markdown p {
          margin-top: 0.35rem;
          margin-bottom: 0.55rem;
        }

        .dashboard-ai-markdown ul {
          margin-top: 0.35rem;
          margin-bottom: 0.75rem;
          padding-left: 1rem;
        }

        .dashboard-ai-markdown li {
          margin-bottom: 0.35rem;
        }

        .dashboard-ai-markdown strong {
          font-weight: 700;
        }
      `}</style>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {(contextMode === 'fiap'
          ? [
              {
                label: 'Novo Aluno',
                desc: 'Cadastrar aluno',
                icon: Users,
                color: 'bg-blue-100 text-blue-600',
                path: '/fiap/alunos/novo',
              },
              {
                label: 'Nova Aula',
                desc: 'Criar aula',
                icon: BookOpen,
                color: 'bg-purple-100 text-purple-600',
                path: '/fiap/aulas/nova',
              },
              {
                label: 'Cronograma',
                desc: 'Ver agenda acadêmica',
                icon: Calendar,
                color: 'bg-indigo-100 text-indigo-600',
                path: '/fiap/cronograma',
              },
              {
                label: 'AI Assistant',
                desc: 'Gerar apoio pedagógico',
                icon: Brain,
                color: 'bg-violet-100 text-violet-600',
                path: '/ai',
              },
            ]
          : [
              {
                label: 'Novo Analista',
                desc: 'Cadastrar analista',
                icon: Briefcase,
                color: 'bg-orange-100 text-orange-600',
                path: '/itau/analistas/novo',
              },
              {
                label: 'Novo Feedback',
                desc: 'Registrar acompanhamento',
                icon: MessageSquare,
                color: 'bg-pink-100 text-pink-600',
                path: '/itau/feedbacks',
              },
              {
                label: 'Nova Reunião',
                desc: 'Agendar reunião',
                icon: Calendar,
                color: 'bg-indigo-100 text-indigo-600',
                path: '/itau/reunioes/nova',
              },
              {
                label: 'AI Assistant',
                desc: 'Gerar apoio gerencial',
                icon: Brain,
                color: 'bg-amber-100 text-amber-600',
                path: '/ai',
              },
            ]
        ).map((item) => (
          <Card
            key={item.path}
            className="cursor-pointer transition-all hover:border-[var(--theme-accent)] hover:shadow-lg"
            onClick={() => navigate(item.path)}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-lg p-2 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-[var(--theme-muted-foreground)]">{item.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--theme-muted-foreground)]" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}