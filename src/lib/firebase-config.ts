import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: 'AIzaSyDdJGEroTfWDcaXFwwKHhE72GpzQVIZYS0',
  authDomain: 'taskos-a2080.firebaseapp.com',
  projectId: 'taskos-a2080',
  storageBucket: 'taskos-a2080.firebasestorage.app',
  messagingSenderId: '221891458549',
  appId: '1:221891458549:web:6c01994bf47a9943321cbc',
  measurementId: 'G-QJGX6F9Z5D',
};

export const app = initializeApp(firebaseConfig);

let analytics;

try {
  if (
    typeof window !== 'undefined' &&
    firebaseConfig.measurementId &&
    firebaseConfig.measurementId !== 'YOUR_MEASUREMENT_ID_HERE'
  ) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error('Erro ao inicializar Analytics:', error);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const COLLECTIONS = {
  AULAS: 'aulas',
  ALUNOS: 'alunos',
  ANALISTAS: 'analistas',
  REUNIOES: 'reunioes',
  TAREFAS: 'tarefas',
  FEEDBACKS: 'feedbacks',
  USUARIOS: 'usuarios',
  MATERIAIS: 'materiais',
  NOTIFICACOES: 'notificacoes',
  // Vida Pessoal
  VIAGENS: 'viagens',
  CUSTOS: 'custos',
  TAREFAS_PESSOAIS: 'tarefas_pessoais',
  // Finanças
  RECEITAS: 'receitas',
} as const;

export { analytics };