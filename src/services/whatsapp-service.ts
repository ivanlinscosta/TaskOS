/**
 * Serviço de WhatsApp - Firebase Integration
 * Integração via Meta WhatsApp Business Cloud API (gratuita)
 */
import {
  collection,
  getDocs,
  getDoc,
  doc,
  Timestamp,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase-config';

export interface WhatsAppMensagem {
  id?: string;
  de: string;
  corpo: string;
  tipoComando?: 'tarefa' | 'reuniao' | 'aula' | 'feedback' | 'viagem' | 'custo' | 'desconhecido';
  entidadeCriada?: string;
  entidadeId?: string;
  processada: boolean;
  erro?: string;
  recebidasEm: Date;
}

function docToMensagem(id: string, data: any): WhatsAppMensagem {
  return {
    id,
    de: data.de || '',
    corpo: data.corpo || '',
    tipoComando: data.tipoComando || 'desconhecido',
    entidadeCriada: data.entidadeCriada || '',
    entidadeId: data.entidadeId || '',
    processada: data.processada ?? false,
    erro: data.erro || '',
    recebidasEm: data.recebidasEm?.toDate?.() || new Date(),
  };
}

export async function listarMensagens(limite = 50): Promise<WhatsAppMensagem[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.WHATSAPP_MENSAGENS),
      limit(limite)
    );
    const snap = await getDocs(q);
    const msgs = snap.docs.map((d) => docToMensagem(d.id, d.data()));
    msgs.sort((a, b) => new Date(b.recebidasEm).getTime() - new Date(a.recebidasEm).getTime());
    return msgs;
  } catch (error) {
    console.error('Erro ao listar mensagens WhatsApp:', error);
    return [];
  }
}

export async function buscarMensagemPorId(id: string): Promise<WhatsAppMensagem | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.WHATSAPP_MENSAGENS, id));
  if (!snap.exists()) return null;
  return docToMensagem(snap.id, snap.data());
}

/**
 * Comandos suportados pelo bot:
 * #tarefa [título] | [descrição] | [prioridade]
 * #reuniao [título] | [data YYYY-MM-DD] | [hora HH:mm] | [participantes]
 * #aula [título] | [disciplina] | [data YYYY-MM-DD]
 * #feedback [analista] | [pontos fortes] | [pontos de melhoria]
 * #viagem [destino] | [data ida YYYY-MM-DD] | [data volta YYYY-MM-DD] | [orçamento]
 * #custo [descrição] | [valor] | [categoria] | [tipo]
 */
export const COMANDOS_WHATSAPP = [
  {
    comando: '#tarefa',
    descricao: 'Cria uma nova tarefa',
    exemplo: '#tarefa Preparar apresentação | Slides para reunião de sexta | alta',
    campos: ['título', 'descrição (opcional)', 'prioridade: baixa | media | alta (opcional)'],
    contexto: 'FIAP ou Itaú',
    cor: '#6A0DAD',
  },
  {
    comando: '#reuniao',
    descricao: 'Agenda uma reunião',
    exemplo: '#reuniao Sprint Planning | 2025-04-15 | 10:00 | João, Maria',
    campos: ['título', 'data (YYYY-MM-DD)', 'hora (HH:mm, opcional)', 'participantes separados por vírgula'],
    contexto: 'Itaú',
    cor: '#EC7000',
  },
  {
    comando: '#aula',
    descricao: 'Registra uma aula',
    exemplo: '#aula Machine Learning Aplicado | Data Science | 2025-04-20',
    campos: ['título', 'disciplina', 'data (YYYY-MM-DD, opcional)'],
    contexto: 'FIAP',
    cor: '#EC7000',
  },
  {
    comando: '#feedback',
    descricao: 'Registra feedback de analista',
    exemplo: '#feedback João Silva | Excelente comunicação | Melhorar documentação',
    campos: ['nome do analista', 'pontos fortes', 'pontos de melhoria'],
    contexto: 'Itaú',
    cor: '#EC7000',
  },
  {
    comando: '#viagem',
    descricao: 'Cadastra uma viagem',
    exemplo: '#viagem Lisboa | 2025-06-01 | 2025-06-10 | 5000',
    campos: ['destino', 'data de ida (YYYY-MM-DD)', 'data de volta (YYYY-MM-DD, opcional)', 'orçamento em R$'],
    contexto: 'Pessoal',
    cor: '#059669',
  },
  {
    comando: '#custo',
    descricao: 'Registra um gasto',
    exemplo: '#custo Jantar restaurante | 85.50 | alimentacao | variavel',
    campos: ['descrição', 'valor em R$', 'categoria', 'tipo: fixa | variavel'],
    contexto: 'Pessoal',
    cor: '#059669',
  },
];
