/**
 * Serviço de Aulas - Firebase Integration
 * 
 * Este arquivo contém funções para gerenciar aulas no Firebase Firestore.
 * 
 * Para usar:
 * 1. Configure o Firebase conforme instruções em firebase-service.ts
 * 2. Descomente as importações e implementações abaixo
 * 3. Use as funções em suas páginas de cadastro
 */

// import { 
//   collection, 
//   addDoc, 
//   updateDoc, 
//   deleteDoc, 
//   doc, 
//   getDocs, 
//   getDoc, 
//   query, 
//   where,
//   orderBy,
//   Timestamp 
// } from 'firebase/firestore';
// import { getDb } from './firebase-service';
import { COLLECTIONS } from '../lib/firebase-config';

export interface Aula {
  id?: string;
  titulo: string;
  disciplina: string;
  data: Date;
  duracao: number;
  descricao: string;
  objetivos: string[];
  topicos: string[];
  materiais: Array<{
    tipo: string;
    nome: string;
    url: string;
  }>;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * Cria uma nova aula no Firestore
 */
export async function criarAula(aula: Omit<Aula, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
  // Implementação mock para desenvolvimento
  console.log('Mock: Criando aula', aula);
  return Promise.resolve('mock-id-' + Date.now());
  
  // Descomente quando o Firebase estiver configurado:
  /*
  const db = getDb();
  if (!db) throw new Error('Firebase não inicializado');
  
  const aulaData = {
    ...aula,
    data: Timestamp.fromDate(aula.data),
    criadoEm: Timestamp.now(),
    atualizadoEm: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, COLLECTIONS.AULAS), aulaData);
  return docRef.id;
  */
}

/**
 * Atualiza uma aula existente
 */
export async function atualizarAula(id: string, aula: Partial<Aula>): Promise<void> {
  // Implementação mock
  console.log('Mock: Atualizando aula', id, aula);
  return Promise.resolve();
  
  // Descomente quando o Firebase estiver configurado:
  /*
  const db = getDb();
  if (!db) throw new Error('Firebase não inicializado');
  
  const aulaData: any = { ...aula, atualizadoEm: Timestamp.now() };
  
  if (aula.data) {
    aulaData.data = Timestamp.fromDate(aula.data);
  }
  
  await updateDoc(doc(db, COLLECTIONS.AULAS, id), aulaData);
  */
}

/**
 * Deleta uma aula
 */
export async function deletarAula(id: string): Promise<void> {
  // Implementação mock
  console.log('Mock: Deletando aula', id);
  return Promise.resolve();
  
  // Descomente quando o Firebase estiver configurado:
  /*
  const db = getDb();
  if (!db) throw new Error('Firebase não inicializado');
  
  await deleteDoc(doc(db, COLLECTIONS.AULAS, id));
  */
}

/**
 * Busca uma aula por ID
 */
export async function buscarAulaPorId(id: string): Promise<Aula | null> {
  // Implementação mock
  console.log('Mock: Buscando aula', id);
  return Promise.resolve(null);
  
  // Descomente quando o Firebase estiver configurado:
  /*
  const db = getDb();
  if (!db) throw new Error('Firebase não inicializado');
  
  const docSnap = await getDoc(doc(db, COLLECTIONS.AULAS, id));
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      data: data.data.toDate(),
      criadoEm: data.criadoEm?.toDate(),
      atualizadoEm: data.atualizadoEm?.toDate(),
    } as Aula;
  }
  
  return null;
  */
}

/**
 * Lista todas as aulas
 */
export async function listarAulas(filtros?: { disciplina?: string }): Promise<Aula[]> {
  // Implementação mock
  console.log('Mock: Listando aulas', filtros);
  return Promise.resolve([]);
  
  // Descomente quando o Firebase estiver configurado:
  /*
  const db = getDb();
  if (!db) throw new Error('Firebase não inicializado');
  
  let q = query(collection(db, COLLECTIONS.AULAS), orderBy('data', 'desc'));
  
  if (filtros?.disciplina) {
    q = query(q, where('disciplina', '==', filtros.disciplina));
  }
  
  const querySnapshot = await getDocs(q);
  const aulas: Aula[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    aulas.push({
      id: doc.id,
      ...data,
      data: data.data.toDate(),
      criadoEm: data.criadoEm?.toDate(),
      atualizadoEm: data.atualizadoEm?.toDate(),
    } as Aula);
  });
  
  return aulas;
  */
}

/**
 * Exemplo de uso no componente:
 * 
 * import { criarAula } from '../../services/aulas-service';
 * 
 * const handleSubmit = async (e: React.FormEvent) => {
 *   e.preventDefault();
 *   try {
 *     const aulaId = await criarAula({
 *       titulo: formData.titulo,
 *       disciplina: formData.disciplina,
 *       data: new Date(formData.data),
 *       duracao: parseInt(formData.duracao),
 *       descricao: formData.descricao,
 *       objetivos: formData.objetivos,
 *       topicos: formData.topicos,
 *       materiais: formData.materiais,
 *     });
 *     console.log('Aula criada com ID:', aulaId);
 *     navigate('/fiap/aulas');
 *   } catch (error) {
 *     console.error('Erro ao criar aula:', error);
 *     alert('Erro ao criar aula. Tente novamente.');
 *   }
 * };
 */
