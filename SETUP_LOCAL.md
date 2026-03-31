# DualOS - Sistema Operacional Híbrido FIAP + Itaú

Sistema operacional pessoal completo para gestão híbrida entre FIAP (educação) e Itaú (corporativo), funcionando como um Notion + Jira + Salesforce + LMS + AI Copilot integrado.

## 🚀 Características

- **Dois Temas Visuais Distintos:**
  - **Tema FIAP:** Preto absoluto #000000, roxo neon #6A0DAD, dark mode futurista com glow
  - **Tema Itaú:** Laranja #EC7000, azul #003A8F, dashboard executivo denso

- **Módulos Completos:**
  - 📚 Gestão de Alunos/Analistas
  - 🎓 Aulas/Reuniões
  - 📋 Kanban
  - 📅 Cronograma
  - 💬 Feedbacks
  - 🤖 **AI Assistant Conversacional**

- **AI Assistant:**
  - Interface de chat em tempo real
  - Geração de planos de aula
  - Avaliações de alunos e analistas
  - Cadastro de novos registros
  - Integração com formulários (dados pré-preenchidos)

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou pnpm instalado

## 🔧 Instalação

### 1. Clone ou baixe o projeto

```bash
# Se você tem o repositório
git clone [url-do-repositorio]
cd dualos

# Ou extraia o arquivo ZIP baixado
```

### 2. Instale as dependências

**Com npm:**
```bash
npm install
```

**Com pnpm (recomendado):**
```bash
pnpm install
```

### 3. Execute o projeto em desenvolvimento

**Com npm:**
```bash
npm run dev
```

**Com pnpm:**
```bash
pnpm dev
```

O aplicativo estará disponível em: **http://localhost:5173**

## 📦 Build para Produção

**Com npm:**
```bash
npm run build
```

**Com pnpm:**
```bash
pnpm build
```

Para testar o build de produção localmente:
```bash
npm run preview
# ou
pnpm preview
```

## 🗂️ Estrutura do Projeto

```
dualos/
├── index.html              # Arquivo HTML principal
├── package.json            # Dependências e scripts
├── vite.config.ts          # Configuração do Vite
├── src/
│   ├── main.tsx            # Entrada da aplicação
│   ├── app/
│   │   ├── App.tsx         # Componente principal
│   │   ├── routes.tsx      # Configuração de rotas
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   │   ├── ai-assistant.tsx   # 🤖 AI Assistant
│   │   │   ├── fiap/       # Páginas FIAP
│   │   │   └── itau/       # Páginas Itaú
│   │   └── layouts/        # Layouts
│   ├── lib/                # Utilitários e contextos
│   │   ├── theme-context.tsx  # Contexto de tema
│   │   └── ...
│   ├── services/           # Serviços (Firebase, etc)
│   └── styles/             # Estilos globais
│       ├── index.css
│       ├── theme.css
│       └── ...
└── README.md
```

## 🎨 Temas

O DualOS possui dois temas completos:

### Tema FIAP
- Cor Principal: Roxo Neon (#6A0DAD)
- Background: Preto (#000000)
- Estilo: Dark mode futurista com efeitos glow

### Tema Itaú
- Cor Principal: Laranja (#EC7000)
- Secundária: Azul (#003A8F)
- Estilo: Dashboard executivo profissional

**Alternância de tema:** Use o selector no header para alternar entre FIAP e Itaú.

## 🤖 AI Assistant

O AI Assistant é uma funcionalidade central do DualOS:

### Como Usar:

1. Acesse o menu "IA Assistant" no sidebar
2. Digite sua solicitação de forma natural, exemplo:
   - "Crie um plano de aula sobre Machine Learning"
   - "Preciso avaliar um aluno de Python"
   - "Gere uma avaliação para um analista sênior"
3. A IA gerará o conteúdo completo
4. Clique em "Adicionar na Página" para pré-preencher formulários
5. Complete os campos restantes e salve

### Quick Prompts:
- 📚 Plano de Aula (FIAP)
- 📝 Avaliação de Aluno (FIAP)
- 🎓 Nova Aula (FIAP)
- ⭐ Avaliação de Analista (Itaú)
- 👥 Nova Reunião (Itaú)
- 💼 Feedback de Time (Itaú)

## 🔥 Firebase (Opcional)

O projeto está preparado para integração com Firebase. Para configurar:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Configure as credenciais em `/src/lib/firebase-config.ts`
3. Ative os serviços necessários (Firestore, Authentication, etc)

Consulte `FIREBASE_SETUP.md` para instruções detalhadas.

## 🛠️ Tecnologias

- **React 18.3** + TypeScript
- **Vite 6.3** - Build tool
- **TailwindCSS 4.1** - Estilização
- **React Router 7** - Navegação
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Motion** - Animações
- **Recharts** - Gráficos
- **React DnD** - Drag and Drop

## 📱 Funcionalidades

### FIAP (Educação)
- ✅ Gestão de alunos
- ✅ Aulas e cronograma
- ✅ Avaliações acadêmicas
- ✅ Kanban de tarefas
- ✅ AI Assistant para planos de aula

### Itaú (Corporativo)
- ✅ Gestão de analistas
- ✅ Reuniões e feedbacks
- ✅ Avaliações de performance
- ✅ Kanban de projetos
- ✅ AI Assistant para avaliações

## 🐛 Troubleshooting

### Erro ao instalar dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Porta 5173 ocupada
Edite `vite.config.ts` e adicione:
```typescript
export default defineConfig({
  server: {
    port: 3000 // ou outra porta
  },
  // ... resto da config
})
```

### Erro de módulo não encontrado
```bash
# Certifique-se de estar no diretório correto
cd [diretorio-do-projeto]
npm install
```

## 📝 Licença

Projeto acadêmico/corporativo privado.

## 👨‍💻 Suporte

Para questões ou sugestões, consulte a documentação interna ou entre em contato com a equipe de desenvolvimento.

---

**DualOS** - Transformando gestão híbrida em produtividade inteligente 🚀
