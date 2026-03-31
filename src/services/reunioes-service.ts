/**
 * Serviço de Reuniões - Firebase Integration
 */

import { COLLECTIONS } from '../lib/firebase-config';

export interface Reuniao {
  id?: string;
  titulo: string;
  tipo: string;
  data: Date;
  horario: string;
  duracao: number;
  local?: string;
  linkOnline?: string;
  descricao?: string;
  pauta: string[];
  participantes: string[];
  status?: 'agendada' | 'concluida' | 'cancelada';
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export async function criarReuniao(reuniao: Omit<Reuniao, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  console.log('Mock: Criando reunião', reuniao);
  return Promise.resolve('mock-id-' + Date.now());
  
  // Firebase implementation:
  /*
  const db = getDb();
  if (!db) throw new Error('Firebase não inicializado');
  
  const reuniaoData = {
    ...reuniao,
    data: Timestamp.fromDate(reuniao.data),
    status: reuniao.status || 'agendada',
    criadoEm: Timestamp.now(),
    atualizadoEm: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, COLLECTIONS.REUNIOES), reuniaoData);
  return docRef.id;
  */
}

export async function atualizarReuniao(id: string, reuniao: Partial<Reuniao>): Promise<void> {
  console.log('Mock: Atualizando reunião', id, reuniao);
  return Promise.resolve();
}

export async function deletarReuniao(id: string): Promise<void> {
  console.log('Mock: Deletando reunião', id);
  return Promise.resolve();
}

export async function buscarReuniaoPorId(id: string): Promise<Reuniao | null> {
  console.log('Mock: Buscando reunião', id);
  return Promise.resolve(null);
}

export async function listarReunioes(filtros?: { dataInicio?: Date; dataFim?: Date; tipo?: string }): Promise<Reuniao[]> {
  console.log('Mock: Listando reuniões', filtros);
  return Promise.resolve([]);
}

export async function marcarReuniaoComoConcluida(id: string): Promise<void> {
  return atualizarReuniao(id, { status: 'concluida' });
}

export async function cancelarReuniao(id: string): Promise<void> {
  return atualizarReuniao(id, { status: 'cancelada' });
}
