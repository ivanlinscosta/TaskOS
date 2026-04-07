import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase Configuration
// IMPORTANTE: Substitua os valores abaixo com suas credenciais do Firebase Console
// Acesse: https://console.firebase.google.com/
// 1. Crie um novo projeto ou selecione um existente
// 2. Vá em "Configurações do Projeto" > "Seus Aplicativos"
// 3. Adicione um app Web e copie as configurações abaixo

export const firebaseConfig = {
  apiKey: "AIzaSyDdJGEroTfWDcaXFwwKHhE72GpzQVIZYS0",
  authDomain: "taskos-a2080.firebaseapp.com",
  projectId: "taskos-a2080",
  storageBucket: "taskos-a2080.firebasestorage.app",
  messagingSenderId: "221891458549",
  appId: "1:221891458549:web:6c01994bf47a9943321cbc",
  measurementId: "G-QJGX6F9Z5D"
};

// Inicializar Firebase
let app;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  
  // Analytics (apenas em produção/ambiente com window)
  if (typeof window !== 'undefined' && firebaseConfig.measurementId !== "YOUR_MEASUREMENT_ID_HERE") {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
}

// Exportar serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configuração das Collections do Firestore
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
} as const;

export { analytics };