/**
 * Serviço de Aulas - Firebase Integration Completo
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
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase-config';

export interface Material {
  id: string;
  nome: string;
  tipo: 'pdf' | 'ppt' | 'link' | 'video' | 'doc';
  url: string;
  tamanho?: string;
  uploadedAt: Date;
}

export interface Aula {
  id?: string;
  titulo: string;
  disciplina: string;
  descricao: string;
  data: Date;
  duracao: number;
  materiais: Material[];
  tags: string[];
  objetivos?: string[];
  topicos?: string[];
  criadoEm?: Date;
  atualizadoEm?: Date;
}

const COLLECTION_NAME = 'aulas';

/**
 * Cria uma nova aula no Firebase
 */
export async function criarAula(aula: Omit<Aula, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  try {
    const aulaData = {
      ...aula,
      data: Timestamp.fromDate(new Date(aula.data)),
      materiais: (aula.materiais || []).map((m) => ({
        ...m,
        uploadedAt: Timestamp.fromDate(new Date(m.uploadedAt)),
      })),
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), aulaData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    throw error;
  }
}

/**
 * Atualiza uma aula existente
 */
export async function atualizarAula(id: string, aula: Partial<Aula>): Promise<void> {
  try {
    const aulaRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = { ...aula };

    if (aula.data) {
      updateData.data = Timestamp.fromDate(new Date(aula.data));
    }

    if (aula.materiais) {
      updateData.materiais = aula.materiais.map((m) => ({
        ...m,
        uploadedAt: Timestamp.fromDate(new Date(m.uploadedAt)),
      }));
    }

    updateData.atualizadoEm = Timestamp.now();

    await updateDoc(aulaRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    throw error;
  }
}

/**
 * Deleta uma aula
 */
export async function deletarAula(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Erro ao deletar aula:', error);
    throw error;
  }
}

/**
 * Busca uma aula por ID
 */
export async function buscarAulaPorId(id: string): Promise<Aula | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        data: data.data?.toDate?.() || new Date(),
        materiais: (data.materiais || []).map((m: any) => ({
          ...m,
          uploadedAt: m.uploadedAt?.toDate?.() || new Date(),
        })),
        criadoEm: data.criadoEm?.toDate?.() || new Date(),
        atualizadoEm: data.atualizadoEm?.toDate?.() || new Date(),
      } as Aula;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar aula:', error);
    throw error;
  }
}

/**
 * Lista todas as aulas (sem orderBy para evitar necessidade de índice)
 */
export async function listarAulas(): Promise<Aula[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));

    const aulas = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        data: data.data?.toDate?.() || new Date(),
        materiais: (data.materiais || []).map((m: any) => ({
          ...m,
          uploadedAt: m.uploadedAt?.toDate?.() || new Date(),
        })),
        criadoEm: data.criadoEm?.toDate?.() || new Date(),
        atualizadoEm: data.atualizadoEm?.toDate?.() || new Date(),
      } as Aula;
    });

    // Ordenar no client-side
    aulas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    return aulas;
  } catch (error) {
    console.error('Erro ao listar aulas:', error);
    return [];
  }
}

/**
 * Lista aulas por disciplina (filtro no client-side)
 */
export async function listarAulasPorDisciplina(disciplina: string): Promise<Aula[]> {
  try {
    const aulas = await listarAulas();
    return aulas.filter(a => a.disciplina === disciplina);
  } catch (error) {
    console.error('Erro ao listar aulas por disciplina:', error);
    return [];
  }
}

/**
 * Lista aulas por tag (filtro no client-side)
 */
export async function listarAulasPorTag(tag: string): Promise<Aula[]> {
  try {
    const aulas = await listarAulas();
    return aulas.filter(a => a.tags?.includes(tag));
  } catch (error) {
    console.error('Erro ao listar aulas por tag:', error);
    return [];
  }
}
