/**
 * Chat Save Service — persiste dados coletados no chat guiado no Firebase
 */
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, COLLECTIONS, auth } from '../lib/firebase-config';
import { criarCusto } from './custos-service';
import { criarTarefaPessoal } from './tarefas-pessoais-service';
import { createTask } from './tarefas-firebase-service';
import { criarViagem } from './viagens-service';

export type ChatAction    = 'tarefa' | 'gasto' | 'feedback' | 'viagem';
export type ChatWorkspace = 'fiap' | 'itau' | 'pessoal';

/**
 * Ponto de entrada único: recebe ação, workspace e respostas coletadas,
 * roteia para a persistência correta no Firestore.
 */
export async function saveChatData(
  action: ChatAction,
  workspace: ChatWorkspace,
  answers: Record<string, string>,
): Promise<string> {
  switch (action) {
    case 'tarefa':   return saveTarefa(workspace, answers);
    case 'gasto':    return saveGasto(answers);
    case 'feedback': return saveFeedback(workspace, answers);
    case 'viagem':   return saveViagem(answers);
  }
}

// ── Tarefa ────────────────────────────────────────────────────────────────────

async function saveTarefa(
  workspace: ChatWorkspace,
  answers: Record<string, string>,
): Promise<string> {
  if (workspace === 'pessoal') {
    const prioMap: Record<string, 'baixa' | 'media' | 'alta'> = {
      low: 'baixa', medium: 'media', high: 'alta',
      baixa: 'baixa', media: 'media', alta: 'alta',
    };
    return criarTarefaPessoal({
      titulo: answers.titulo,
      descricao: answers.descricao || undefined,
      status: 'backlog',
      prioridade: prioMap[answers.prioridade] ?? 'media',
      categoria: 'pessoal',
      dataVencimento: answers.prazo ? new Date(answers.prazo) : undefined,
    });
  }

  const userId = auth.currentUser?.uid ?? 'chat';
  return createTask(
    {
      id: '',
      title: answers.titulo,
      description: answers.descricao ?? '',
      status: 'backlog',
      priority: (answers.prioridade as 'low' | 'medium' | 'high') ?? 'medium',
      context: workspace as 'fiap' | 'itau',
      tags: [],
      checklist: [],
      dueDate: answers.prazo ? new Date(answers.prazo) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    userId,
  );
}

// ── Gasto ─────────────────────────────────────────────────────────────────────

async function saveGasto(answers: Record<string, string>): Promise<string> {
  return criarCusto({
    descricao: answers.descricao,
    valor: parseFloat(answers.valor) || 0,
    categoria: (answers.categoria as any) ?? 'outros',
    tipo: 'variavel',
    data: answers.data ? new Date(answers.data) : new Date(),
    notas: answers.notas || undefined,
  });
}

// ── Feedback ──────────────────────────────────────────────────────────────────

async function saveFeedback(
  workspace: ChatWorkspace,
  answers: Record<string, string>,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.FEEDBACKS), {
    pessoa:     answers.pessoa,
    tipo:       answers.tipo ?? 'positivo',
    contexto:   answers.contexto ?? '',
    descricao:  answers.descricao,
    workspace,
    origem:     'chat_guiado',
    data:       Timestamp.now(),
    criadoEm:   Timestamp.now(),
  });
  return ref.id;
}

// ── Viagem ────────────────────────────────────────────────────────────────────

async function saveViagem(answers: Record<string, string>): Promise<string> {
  if (!answers.dataIda) throw new Error('Data de ida é obrigatória');
  return criarViagem({
    destino:            answers.destino,
    descricao:          answers.objetivo ?? '',
    dataIda:            new Date(answers.dataIda),
    dataVolta:          answers.dataVolta ? new Date(answers.dataVolta) : undefined,
    orcamento:          0,
    gastoReal:          0,
    status:             'planejada',
    atividades:         [],
    orcamentoDetalhado: [],
    notas:              '',
  });
}
