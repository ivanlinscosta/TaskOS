# Guia de Uso dos Serviços Firebase - DualOS

Este guia mostra como usar os serviços Firebase criados nas páginas de cadastro do DualOS.

## Estrutura de Arquivos

```
/src
  /services
    firebase-service.ts      # Serviço base do Firebase
    aulas-service.ts         # CRUD de Aulas (FIAP)
    alunos-service.ts        # CRUD de Alunos (FIAP)
    analistas-service.ts     # CRUD de Analistas (Itaú)
    reunioes-service.ts      # CRUD de Reuniões (Itaú)
    tarefas-service.ts       # CRUD de Tarefas (Ambos)
  /lib
    firebase-config.ts       # Configuração das credenciais
```

## 1. Usando em Páginas de Cadastro

### Exemplo: Nova Aula (FIAP)

Arquivo: `/src/app/pages/fiap/nova-aula.tsx`

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { criarAula } from '../../../services/aulas-service';

export function NovaAula() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    disciplina: '',
    data: '',
    duracao: '',
    descricao: '',
    objetivos: [''],
    topicos: [''],
    materiais: [{ tipo: 'pdf', nome: '', url: '' }],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const aulaId = await criarAula({
        titulo: formData.titulo,
        disciplina: formData.disciplina,
        data: new Date(formData.data),
        duracao: parseInt(formData.duracao),
        descricao: formData.descricao,
        objetivos: formData.objetivos.filter(o => o.trim() !== ''),
        topicos: formData.topicos.filter(t => t.trim() !== ''),
        materiais: formData.materiais.filter(m => m.nome && m.url),
      });
      
      console.log('Aula criada com ID:', aulaId);
      alert('Aula cadastrada com sucesso!');
      navigate('/fiap/aulas');
    } catch (error) {
      console.error('Erro ao criar aula:', error);
      alert('Erro ao cadastrar aula. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos do formulário ... */}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar Aula'}
      </Button>
    </form>
  );
}
```

### Exemplo: Listando Aulas

Arquivo: `/src/app/pages/fiap/aulas.tsx`

```typescript
import { useState, useEffect } from 'react';
import { listarAulas, deletarAula } from '../../services/aulas-service';
import type { Aula } from '../../services/aulas-service';

export function Aulas() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarAulas();
  }, []);

  const carregarAulas = async () => {
    try {
      setIsLoading(true);
      const data = await listarAulas();
      setAulas(data);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
      alert('Erro ao carregar aulas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta aula?')) return;
    
    try {
      await deletarAula(id);
      alert('Aula deletada com sucesso!');
      carregarAulas(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao deletar aula:', error);
      alert('Erro ao deletar aula');
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {aulas.map(aula => (
        <div key={aula.id}>
          <h3>{aula.titulo}</h3>
          <button onClick={() => handleDelete(aula.id!)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 2. Funcionalidades por Serviço

### Aulas Service

```typescript
import { 
  criarAula, 
  atualizarAula, 
  deletarAula, 
  buscarAulaPorId, 
  listarAulas 
} from '../../services/aulas-service';

// Criar nova aula
const aulaId = await criarAula({
  titulo: 'React Avançado',
  disciplina: 'Frontend',
  data: new Date('2026-04-15'),
  duracao: 90,
  descricao: 'Aula sobre hooks avançados',
  objetivos: ['Entender useEffect', 'Criar custom hooks'],
  topicos: ['useEffect', 'useReducer', 'Custom Hooks'],
  materiais: [
    { tipo: 'pdf', nome: 'Slides', url: 'https://...' }
  ]
});

// Atualizar aula
await atualizarAula('aula-id', {
  titulo: 'React Avançado - Atualizado',
  duracao: 120
});

// Buscar por ID
const aula = await buscarAulaPorId('aula-id');

// Listar com filtro
const aulasFrontend = await listarAulas({ disciplina: 'Frontend' });

// Deletar
await deletarAula('aula-id');
```

### Alunos Service

```typescript
import { 
  criarAluno, 
  atualizarAluno, 
  buscarAlunoPorRA, 
  listarAlunos 
} from '../../services/alunos-service';

// Criar novo aluno
const alunoId = await criarAluno({
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(11) 98765-4321',
  turma: '2TDSPN',
  periodo: 'Noite',
  curso: 'ADS',
  ra: 'RM123456',
  dataNascimento: new Date('2000-05-15'),
  cidade: 'São Paulo',
  estado: 'SP'
});

// Buscar por RA
const aluno = await buscarAlunoPorRA('RM123456');

// Listar por turma
const alunos = await listarAlunos({ turma: '2TDSPN' });
```

### Analistas Service

```typescript
import { 
  criarAnalista, 
  atualizarAnalista, 
  listarAnalistas 
} from '../../services/analistas-service';

// Criar novo analista
const analistaId = await criarAnalista({
  nome: 'Maria Santos',
  email: 'maria.santos@itau.com.br',
  telefone: '(11) 91234-5678',
  funcao: 'Analista de Sistemas',
  squad: 'Payments Squad',
  senioridade: 'Senior',
  dataAdmissao: new Date('2022-03-01'),
  dataNascimento: new Date('1990-08-20'),
  skills: 'React, Node.js, AWS'
});

// Listar por squad
const analistas = await listarAnalistas({ squad: 'Payments Squad' });

// Listar por senioridade
const seniors = await listarAnalistas({ senioridade: 'Senior' });
```

### Reuniões Service

```typescript
import { 
  criarReuniao, 
  atualizarReuniao, 
  marcarReuniaoComoConcluida,
  cancelarReuniao,
  listarReunioes 
} from '../../services/reunioes-service';

// Criar nova reunião
const reuniaoId = await criarReuniao({
  titulo: 'Sprint Planning Q2',
  tipo: 'planning',
  data: new Date('2026-04-10'),
  horario: '14:00',
  duracao: 60,
  local: 'Sala 3 - 15º andar',
  linkOnline: 'https://teams.microsoft.com/...',
  descricao: 'Planejamento da sprint 42',
  pauta: ['Review da sprint anterior', 'Definição de metas', 'Distribuição de tarefas'],
  participantes: ['joao@itau.com.br', 'maria@itau.com.br']
});

// Marcar como concluída
await marcarReuniaoComoConcluida('reuniao-id');

// Cancelar reunião
await cancelarReuniao('reuniao-id');

// Listar reuniões do período
const reunioes = await listarReunioes({
  dataInicio: new Date('2026-04-01'),
  dataFim: new Date('2026-04-30')
});
```

### Tarefas Service

```typescript
import { 
  criarTarefa, 
  atualizarTarefa,
  mudarStatusTarefa,
  mudarPrioridadeTarefa,
  listarTarefas 
} from '../../services/tarefas-service';

// Criar nova tarefa
const tarefaId = await criarTarefa({
  titulo: 'Implementar API de pagamentos',
  descricao: 'Criar endpoints REST para processar pagamentos',
  prioridade: 'alta',
  categoria: 'Backend',
  dataEntrega: new Date('2026-04-20'),
  responsavel: 'João Silva',
  status: 'todo',
  contexto: 'itau',
  squad: 'Payments Squad',
  sprint: 'Sprint 42',
  tags: ['backend', 'api', 'payments']
});

// Mudar status
await mudarStatusTarefa('tarefa-id', 'in-progress');

// Mudar prioridade
await mudarPrioridadeTarefa('tarefa-id', 'critica');

// Listar tarefas do Itaú em progresso
const tarefas = await listarTarefas({
  contexto: 'itau',
  status: 'in-progress'
});

// Listar tarefas urgentes
const urgentes = await listarTarefas({
  prioridade: 'alta'
});
```

## 3. Tratamento de Erros

Sempre use try-catch ao fazer operações com Firebase:

```typescript
const handleOperation = async () => {
  try {
    setIsLoading(true);
    const result = await someFirebaseOperation();
    // Sucesso
    alert('Operação realizada com sucesso!');
  } catch (error) {
    // Tratar erros específicos
    if (error.code === 'permission-denied') {
      alert('Você não tem permissão para esta operação');
    } else if (error.code === 'unavailable') {
      alert('Serviço temporariamente indisponível. Tente novamente.');
    } else {
      console.error('Erro:', error);
      alert('Erro ao realizar operação');
    }
  } finally {
    setIsLoading(false);
  }
};
```

## 4. Estados de Loading

Sempre mostre feedback visual durante operações:

```typescript
function FormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
      
      <Button type="submit" disabled={isSaving}>
        {isSaving ? (
          <>
            <Spinner className="mr-2" />
            Salvando...
          </>
        ) : (
          'Salvar'
        )}
      </Button>
    </form>
  );
}
```

## 5. Validação de Dados

Valide os dados antes de enviar para o Firebase:

```typescript
const validarAula = (data: any) => {
  if (!data.titulo || data.titulo.trim() === '') {
    throw new Error('Título é obrigatório');
  }
  
  if (!data.data || isNaN(data.data.getTime())) {
    throw new Error('Data inválida');
  }
  
  if (data.duracao < 15) {
    throw new Error('Duração mínima é 15 minutos');
  }
  
  return true;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    validarAula(formData);
    const id = await criarAula(formData);
    // ...
  } catch (error) {
    alert(error.message);
  }
};
```

## 6. Queries Otimizadas

Use filtros para reduzir transferência de dados:

```typescript
// Buscar apenas aulas futuras
const aulasFuturas = await listarAulas({
  // Firebase permite adicionar mais filtros quando implementado
});

// Limitar resultados (implementar no service)
const ultimasAulas = await listarAulas({ limit: 10 });
```

## 7. Sincronização em Tempo Real

Para sincronizar dados em tempo real, use listeners do Firestore:

```typescript
// Adicionar ao service (descomente quando Firebase estiver configurado):
/*
import { onSnapshot } from 'firebase/firestore';

export function ouvirAulas(callback: (aulas: Aula[]) => void) {
  const db = getDb();
  const q = query(collection(db, COLLECTIONS.AULAS), orderBy('data', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const aulas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Aula));
    callback(aulas);
  });
}
*/

// Usar no componente:
useEffect(() => {
  const unsubscribe = ouvirAulas((novasAulas) => {
    setAulas(novasAulas);
  });
  
  return () => unsubscribe(); // Cleanup
}, []);
```

## 8. Paginação

Para grandes listas, implemente paginação:

```typescript
// No service (quando implementar):
/*
export async function listarAulasPaginadas(
  limite: number = 20,
  ultimoDoc?: any
) {
  const db = getDb();
  let q = query(
    collection(db, COLLECTIONS.AULAS),
    orderBy('data', 'desc'),
    limit(limite)
  );
  
  if (ultimoDoc) {
    q = query(q, startAfter(ultimoDoc));
  }
  
  const snapshot = await getDocs(q);
  const aulas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const ultimoDocumento = snapshot.docs[snapshot.docs.length - 1];
  
  return { aulas, ultimoDocumento };
}
*/
```

## 9. Upload de Arquivos

Para upload de materiais (PDFs, imagens):

```typescript
// No service (implementar):
/*
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorageInstance } from './firebase-service';

export async function uploadMaterial(
  file: File,
  path: string
): Promise<string> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, `materiais/${path}/${file.name}`);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return url;
}
*/

// Usar no componente:
const handleFileUpload = async (file: File) => {
  try {
    const url = await uploadMaterial(file, 'aulas');
    setFormData({ ...formData, materialUrl: url });
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

## Dicas Importantes

1. **Sempre valide dados no frontend E no backend (regras do Firestore)**
2. **Use estados de loading para melhor UX**
3. **Implemente tratamento de erros robusto**
4. **Considere limites de quota do Firebase**
5. **Use índices compostos para queries complexas**
6. **Implemente cache quando apropriado**
7. **Teste com dados reais antes de produção**
8. **Monitore custos no Firebase Console**

## Próximos Passos

1. Configure o Firebase seguindo `FIREBASE_SETUP.md`
2. Descomente o código nos services
3. Teste cada operação CRUD
4. Implemente funcionalidades avançadas conforme necessário
5. Configure backup automático
6. Monitore performance e custos
