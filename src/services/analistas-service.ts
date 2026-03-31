/**
 * Serviço de Analistas - Firebase Integration
 */

import { COLLECTIONS } from '../lib/firebase-config';

export interface Analista {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  funcao: string;
  squad: string;
  senioridade: string;
  dataAdmissao: Date;
  dataNascimento: Date;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  skills?: string;
  observacoes?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export async function criarAnalista(analista: Omit<Analista, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  console.log('Mock: Criando analista', analista);
  return Promise.resolve('mock-id-' + Date.now());
  
  // Firebase implementation:
  /*
  const db = getDb();
  if (!db) throw new Error('Firebase não inicializado');
  
  const analistaData = {
    ...analista,
    dataAdmissao: Timestamp.fromDate(analista.dataAdmissao),
    dataNascimento: Timestamp.fromDate(analista.dataNascimento),
    criadoEm: Timestamp.now(),
    atualizadoEm: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, COLLECTIONS.ANALISTAS), analistaData);
  return docRef.id;
  */
}

export async function atualizarAnalista(id: string, analista: Partial<Analista>): Promise<void> {
  console.log('Mock: Atualizando analista', id, analista);
  return Promise.resolve();
}

export async function deletarAnalista(id: string): Promise<void> {
  console.log('Mock: Deletando analista', id);
  return Promise.resolve();
}

export async function buscarAnalistaPorId(id: string): Promise<Analista | null> {
  console.log('Mock: Buscando analista', id);
  return Promise.resolve(null);
}

export async function listarAnalistas(filtros?: { squad?: string; senioridade?: string }): Promise<Analista[]> {
  console.log('Mock: Listando analistas', filtros);
  return Promise.resolve([]);
}
