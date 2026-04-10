/**
 * Serviço de Analistas - Firebase Integration Completo
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

export interface Analista {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  funcao: string;
  squad?: string;
  senioridade?: string;
  salario?: number;
  foto?: string;
  dataAdmissao?: Date;
  dataNascimento?: Date;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  skills?: string[];
  avaliacoes?: Array<{ id: string; data: Date; nota: number; comentario: string; tipo: string }>;
  observacoes?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

const COLLECTION_NAME = 'analistas';

/**
 * Cria um novo analista no Firebase
 */
export async function criarAnalista(analista: Omit<Analista, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  try {
    const analistaData: any = {
      ...analista,
      avaliacoes: analista.avaliacoes || [],
      skills: analista.skills || [],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    };

    if (analista.dataAdmissao) {
      analistaData.dataAdmissao = Timestamp.fromDate(new Date(analista.dataAdmissao));
    }
    if (analista.dataNascimento) {
      analistaData.dataNascimento = Timestamp.fromDate(new Date(analista.dataNascimento));
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), analistaData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar analista:', error);
    throw error;
  }
}

/**
 * Atualiza um analista existente
 */
export async function atualizarAnalista(id: string, analista: Partial<Analista>): Promise<void> {
  try {
    const analistaRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = { ...analista };

    if (analista.dataAdmissao) {
      updateData.dataAdmissao = Timestamp.fromDate(new Date(analista.dataAdmissao));
    }
    if (analista.dataNascimento) {
      updateData.dataNascimento = Timestamp.fromDate(new Date(analista.dataNascimento));
    }

    updateData.atualizadoEm = Timestamp.now();

    await updateDoc(analistaRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar analista:', error);
    throw error;
  }
}

/**
 * Deleta um analista
 */
export async function deletarAnalista(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Erro ao deletar analista:', error);
    throw error;
  }
}

/**
 * Busca um analista por ID
 */
export async function buscarAnalistaPorId(id: string): Promise<Analista | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        dataAdmissao: data.dataAdmissao?.toDate?.() || undefined,
        dataNascimento: data.dataNascimento?.toDate?.() || undefined,
        criadoEm: data.criadoEm?.toDate?.() || new Date(),
        atualizadoEm: data.atualizadoEm?.toDate?.() || new Date(),
        avaliacoes: (data.avaliacoes || []).map((av: any) => ({
          ...av,
          data: av.data?.toDate?.() || new Date(),
        })),
      } as Analista;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar analista:', error);
    throw error;
  }
}

/**
 * Lista todos os analistas (sem orderBy para evitar necessidade de índice)
 */
export async function listarAnalistas(filtros?: { funcao?: string; squad?: string }): Promise<Analista[]> {
  try {
    // Query simples sem orderBy - ordena no client-side
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));

    let analistas = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        dataAdmissao: data.dataAdmissao?.toDate?.() || undefined,
        dataNascimento: data.dataNascimento?.toDate?.() || undefined,
        criadoEm: data.criadoEm?.toDate?.() || new Date(),
        atualizadoEm: data.atualizadoEm?.toDate?.() || new Date(),
        avaliacoes: (data.avaliacoes || []).map((av: any) => ({
          ...av,
          data: av.data?.toDate?.() || new Date(),
        })),
      } as Analista;
    });

    // Filtrar no client-side
    if (filtros?.funcao) {
      analistas = analistas.filter(a => a.funcao === filtros.funcao);
    }
    if (filtros?.squad) {
      analistas = analistas.filter(a => a.squad === filtros.squad);
    }

    // Ordenar no client-side
    analistas.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

    return analistas;
  } catch (error) {
    console.error('Erro ao listar analistas:', error);
    return [];
  }
}

/**
 * Lista analistas por função
 */
export async function listarAnalistasPorFuncao(funcao: string): Promise<Analista[]> {
  return listarAnalistas({ funcao });
}

/**
 * Busca um analista por email
 */
export async function buscarAnalistaPorEmail(email: string): Promise<Analista | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docItem = snapshot.docs[0];
    const data = docItem.data();

    return {
      id: docItem.id,
      ...data,
      dataAdmissao: data.dataAdmissao?.toDate?.() || undefined,
      dataNascimento: data.dataNascimento?.toDate?.() || undefined,
      criadoEm: data.criadoEm?.toDate?.() || new Date(),
      atualizadoEm: data.atualizadoEm?.toDate?.() || new Date(),
    } as Analista;
  } catch (error) {
    console.error('Erro ao buscar analista por email:', error);
    throw error;
  }
}

/**
 * Lista analistas por squad
 */
export async function listarAnalistasPorSquad(squad: string): Promise<Analista[]> {
  return listarAnalistas({ squad });
}
