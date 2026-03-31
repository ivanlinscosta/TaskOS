/**
 * Serviço de Alunos - Firebase Integration
 */

import { COLLECTIONS } from '../lib/firebase-config';

export interface Aluno {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  turma: string;
  periodo: string;
  curso: string;
  ra: string;
  dataNascimento: Date;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export async function criarAluno(aluno: Omit<Aluno, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  console.log('Mock: Criando aluno', aluno);
  return Promise.resolve('mock-id-' + Date.now());
  
  // Firebase implementation:
  /*
  const db = getDb();
  if (!db) throw new Error('Firebase não inicializado');
  
  const alunoData = {
    ...aluno,
    dataNascimento: Timestamp.fromDate(aluno.dataNascimento),
    criadoEm: Timestamp.now(),
    atualizadoEm: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, COLLECTIONS.ALUNOS), alunoData);
  return docRef.id;
  */
}

export async function atualizarAluno(id: string, aluno: Partial<Aluno>): Promise<void> {
  console.log('Mock: Atualizando aluno', id, aluno);
  return Promise.resolve();
}

export async function deletarAluno(id: string): Promise<void> {
  console.log('Mock: Deletando aluno', id);
  return Promise.resolve();
}

export async function buscarAlunoPorId(id: string): Promise<Aluno | null> {
  console.log('Mock: Buscando aluno', id);
  return Promise.resolve(null);
}

export async function listarAlunos(filtros?: { turma?: string; curso?: string }): Promise<Aluno[]> {
  console.log('Mock: Listando alunos', filtros);
  return Promise.resolve([]);
}

export async function buscarAlunoPorRA(ra: string): Promise<Aluno | null> {
  console.log('Mock: Buscando aluno por RA', ra);
  return Promise.resolve(null);
}
