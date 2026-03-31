# Configuração do Firebase para DualOS

Este documento explica como configurar o Firebase para integrar o backend com o sistema DualOS.

## Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nomeie seu projeto (ex: "dualos-app")
4. Siga os passos de configuração

## Passo 2: Ativar Serviços

### Firestore Database
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo (produção recomendado)
4. Selecione a região (southamerica-east1 para Brasil)

### Authentication (Opcional)
1. No menu lateral, clique em "Authentication"
2. Ative os métodos de autenticação desejados:
   - Email/Senha
   - Google
   - Microsoft (para Itaú)

### Storage (Opcional - para arquivos)
1. No menu lateral, clique em "Storage"
2. Clique em "Começar"
3. Configure as regras de segurança

## Passo 3: Obter Credenciais

1. Clique no ícone de engrenagem > "Configurações do projeto"
2. Role até "Seus apps" e clique no ícone Web (</>)
3. Registre seu app (ex: "DualOS Web")
4. Copie as credenciais do Firebase Config

## Passo 4: Configurar no Projeto

1. Abra o arquivo `/src/lib/firebase-config.ts`
2. Substitua os valores de `firebaseConfig` com suas credenciais:

```typescript
export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

## Passo 5: Instalar Dependências

Execute no terminal:

```bash
npm install firebase
```

## Passo 6: Ativar os Serviços

1. Abra `/src/services/firebase-service.ts`
2. Descomente todas as importações e implementações
3. Faça o mesmo para os serviços específicos:
   - `aulas-service.ts`
   - `alunos-service.ts`
   - `analistas-service.ts`
   - `reunioes-service.ts`
   - `tarefas-service.ts`

## Passo 7: Configurar Regras de Segurança

### Firestore Rules

Acesse Firestore > Regras e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita autenticada
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Ou regras mais específicas:
    match /aulas/{aulaId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.token.role == 'professor';
    }
    
    match /alunos/{alunoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.token.role in ['professor', 'admin'];
    }
    
    match /analistas/{analistaId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.token.role in ['manager', 'admin'];
    }
    
    match /reunioes/{reuniaoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /tarefas/{tarefaId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules (se usar Storage)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
  }
}
```

## Estrutura das Collections

### aulas
```javascript
{
  titulo: string,
  disciplina: string,
  data: timestamp,
  duracao: number,
  descricao: string,
  objetivos: array,
  topicos: array,
  materiais: array,
  criadoEm: timestamp,
  atualizadoEm: timestamp
}
```

### alunos
```javascript
{
  nome: string,
  email: string,
  telefone: string,
  turma: string,
  periodo: string,
  curso: string,
  ra: string,
  dataNascimento: timestamp,
  endereco: string,
  cidade: string,
  estado: string,
  cep: string,
  observacoes: string,
  criadoEm: timestamp,
  atualizadoEm: timestamp
}
```

### analistas
```javascript
{
  nome: string,
  email: string,
  telefone: string,
  funcao: string,
  squad: string,
  senioridade: string,
  dataAdmissao: timestamp,
  dataNascimento: timestamp,
  endereco: string,
  cidade: string,
  estado: string,
  cep: string,
  skills: string,
  observacoes: string,
  criadoEm: timestamp,
  atualizadoEm: timestamp
}
```

### reunioes
```javascript
{
  titulo: string,
  tipo: string,
  data: timestamp,
  horario: string,
  duracao: number,
  local: string,
  linkOnline: string,
  descricao: string,
  pauta: array,
  participantes: array,
  status: string,
  criadoEm: timestamp,
  atualizadoEm: timestamp
}
```

### tarefas
```javascript
{
  titulo: string,
  descricao: string,
  prioridade: string,
  categoria: string,
  dataEntrega: timestamp,
  responsavel: string,
  status: string,
  contexto: string,
  squad: string,
  sprint: string,
  tags: array,
  criadoEm: timestamp,
  atualizadoEm: timestamp
}
```

## Exemplo de Uso

Após configurar, você pode usar os serviços nas páginas:

```typescript
import { criarAula } from '../../services/aulas-service';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const aulaId = await criarAula({
      titulo: formData.titulo,
      disciplina: formData.disciplina,
      data: new Date(formData.data),
      duracao: parseInt(formData.duracao),
      descricao: formData.descricao,
      objetivos: formData.objetivos,
      topicos: formData.topicos,
      materiais: formData.materiais,
    });
    console.log('Aula criada com ID:', aulaId);
    navigate('/fiap/aulas');
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    alert('Erro ao criar aula.');
  }
};
```

## Indexação (Opcional mas Recomendado)

Para queries complexas, crie índices compostos:

1. Acesse Firestore > Índices
2. Crie índices para:
   - `tarefas`: (contexto, status, dataEntrega)
   - `aulas`: (disciplina, data)
   - `reunioes`: (data, status)

## Backup e Manutenção

1. Configure backups automáticos no Firebase Console
2. Monitore uso de quotas em "Usage and billing"
3. Configure alertas para detectar anomalias

## Custos

- Firestore: Gratuito até 50k leituras/dia
- Storage: 5GB gratuito
- Authentication: Gratuito

Para produção, considere upgrade conforme necessário.

## Suporte

- [Documentação Firebase](https://firebase.google.com/docs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase Community](https://firebase.google.com/community)
