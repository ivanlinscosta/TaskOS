/**
 * Serviço de Alunos - Firebase Integration Completo
 * Queries simplificadas (sem orderBy no Firestore) para evitar necessidade de índice
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase-config';

export interface Aluno {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  turma?: string;
  periodo?: string;
  curso?: string;
  ra?: string;
  foto?: string;
  notas?: Array<{ id: string; disciplina: string; valor: number; data: Date; tipo: string }>;
  dataNascimento?: Date;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

const COLLECTION_NAME = 'alunos';

/**
 * Cria um novo aluno no Firebase
 */
export async function criarAluno(aluno: Omit<Aluno, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  try {
    const alunoData: any = {
      ...aluno,
      notas: aluno.notas || [],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    };

    if (aluno.dataNascimento) {
      alunoData.dataNascimento = Timestamp.fromDate(new Date(aluno.dataNascimento));
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), alunoData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    throw error;
  }
}

/**
 * Atualiza um aluno existente
 */
export async function atualizarAluno(id: string, aluno: Partial<Aluno>): Promise<void> {
  try {
    const alunoRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = { ...aluno };

    if (aluno.dataNascimento) {
      updateData.dataNascimento = Timestamp.fromDate(new Date(aluno.dataNascimento));
    }

    updateData.atualizadoEm = Timestamp.now();

    await updateDoc(alunoRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    throw error;
  }
}

/**
 * Deleta um aluno
 */
export async function deletarAluno(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    throw error;
  }
}

/**
 * Busca um aluno por ID
 */
export async function buscarAlunoPorId(id: string): Promise<Aluno | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        dataNascimento: data.dataNascimento?.toDate?.() || undefined,
        criadoEm: data.criadoEm?.toDate?.() || new Date(),
        atualizadoEm: data.atualizadoEm?.toDate?.() || new Date(),
        notas: (data.notas || []).map((n: any) => ({
          ...n,
          data: n.data?.toDate?.() || new Date(),
        })),
      } as Aluno;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    throw error;
  }
}

/**
 * Lista todos os alunos (sem orderBy para evitar necessidade de índice)
 */
export async function listarAlunos(filtros?: { turma?: string; curso?: string }): Promise<Aluno[]> {
  try {
    // Query simples sem orderBy - ordena no client-side
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));

    let alunos = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        dataNascimento: data.dataNascimento?.toDate?.() || undefined,
        criadoEm: data.criadoEm?.toDate?.() || new Date(),
        atualizadoEm: data.atualizadoEm?.toDate?.() || new Date(),
        notas: (data.notas || []).map((n: any) => ({
          ...n,
          data: n.data?.toDate?.() || new Date(),
        })),
      } as Aluno;
    });

    // Filtrar no client-side
    if (filtros?.turma) {
      alunos = alunos.filter(a => a.turma === filtros.turma);
    }
    if (filtros?.curso) {
      alunos = alunos.filter(a => a.curso === filtros.curso);
    }

    // Ordenar no client-side
    alunos.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

    return alunos;
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    return [];
  }
}

/**
 * Busca um aluno por RA
 */
export async function buscarAlunoPorRA(ra: string): Promise<Aluno | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('ra', '==', ra));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docItem = snapshot.docs[0];
    const data = docItem.data();

    return {
      id: docItem.id,
      ...data,
      dataNascimento: data.dataNascimento?.toDate?.() || undefined,
      criadoEm: data.criadoEm?.toDate?.() || new Date(),
      atualizadoEm: data.atualizadoEm?.toDate?.() || new Date(),
    } as Aluno;
  } catch (error) {
    console.error('Erro ao buscar aluno por RA:', error);
    throw error;
  }
}

/**
 * Lista alunos por turma
 */
export async function listarAlunosPorTurma(turma: string): Promise<Aluno[]> {
  return listarAlunos({ turma });
}

/**
 * Lista alunos por curso
 */
export async function listarAlunosPorCurso(curso: string): Promise<Aluno[]> {
  return listarAlunos({ curso });
}
