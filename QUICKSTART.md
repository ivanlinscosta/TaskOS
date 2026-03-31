# 🚀 Guia Rápido de Início - DualOS

## Instalação em 3 Passos

### 1️⃣ Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

**Ou se você usa pnpm:**
```bash
pnpm install
```

⏱️ **Tempo estimado:** 2-5 minutos

---

### 2️⃣ Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

**Ou com pnpm:**
```bash
pnpm dev
```

Você verá algo como:
```
  VITE v6.3.5  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 3️⃣ Abrir no Navegador

Acesse: **http://localhost:5173**

✅ **Pronto!** O DualOS está rodando!

---

## 🎯 Primeiros Passos no Sistema

### 1. Escolha o Contexto
No header, selecione entre:
- **FIAP** (roxo) - Gestão educacional
- **Itaú** (laranja) - Gestão corporativa

### 2. Explore o Dashboard
- Métricas e estatísticas atualizadas
- Visão geral do contexto selecionado

### 3. Teste o AI Assistant 🤖

**Acesse:** Menu lateral > "IA Assistant"

**Experimente:**
```
"Crie um plano de aula sobre Machine Learning"
```

**Ou clique nos Quick Prompts:**
- 📚 Plano de Aula
- 📝 Avaliação de Aluno
- ⭐ Avaliação de Analista

**Depois:**
1. Clique em "Adicionar na Página"
2. Formulário abre pré-preenchido
3. Complete e salve!

---

## 📂 Páginas Disponíveis

### 🎓 FIAP (Tema Roxo)
- `/fiap` - Dashboard
- `/fiap/alunos` - Gestão de Alunos
- `/fiap/aulas` - Gestão de Aulas
- `/fiap/kanban` - Kanban de Tarefas
- `/fiap/cronograma` - Cronograma

### 💼 Itaú (Tema Laranja)
- `/itau` - Dashboard
- `/itau/analistas` - Gestão de Analistas
- `/itau/reunioes` - Gestão de Reuniões
- `/itau/kanban` - Kanban de Projetos
- `/itau/feedbacks` - Feedbacks

### 🤖 Global
- `/ai-assistant` - AI Assistant Conversacional

---

## ⚙️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build

# Limpar e reinstalar (se tiver problemas)
rm -rf node_modules
npm install
```

---

## 🆘 Problemas Comuns

### ❌ Erro: "Cannot find module"
**Solução:**
```bash
npm install
```

### ❌ Porta 5173 ocupada
**Solução 1:** Feche outras aplicações usando essa porta

**Solução 2:** Mude a porta em `vite.config.ts`:
```typescript
export default defineConfig({
  server: { port: 3000 },
  // ...
})
```

### ❌ Página em branco
**Solução:**
1. Verifique o console do navegador (F12)
2. Limpe cache do navegador (Ctrl+Shift+R)
3. Reinstale dependências

---

## 💡 Dicas

1. **Use o modo escuro** - DualOS foi otimizado para dark mode
2. **Explore os temas** - Alterne entre FIAP e Itaú para ver as diferenças
3. **AI Assistant é seu amigo** - Use para gerar conteúdo rapidamente
4. **Atalhos de teclado** - Enter para enviar no chat, Shift+Enter para nova linha

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- `SETUP_LOCAL.md` - Guia completo de instalação
- `FIREBASE_SETUP.md` - Configuração Firebase (opcional)
- `README.md` - Documentação geral

---

## ✅ Checklist de Verificação

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto em `localhost:5173`
- [ ] Dashboard carregando corretamente
- [ ] Consegue alternar entre temas FIAP/Itaú
- [ ] AI Assistant respondendo

---

**Tudo funcionando?** 🎉

Agora você está pronto para usar o DualOS!

Para dúvidas, consulte a documentação ou entre em contato com o suporte.
