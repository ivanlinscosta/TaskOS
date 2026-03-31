# 🔧 Troubleshooting - DualOS

## Problemas Comuns e Soluções

### 1. ❌ Erro: "Cannot find module" ou "Module not found"

**Causa:** Dependências não instaladas ou corrompidas

**Solução:**
```bash
# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou com pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

### 2. ❌ Porta 5173 já está em uso

**Erro no terminal:**
```
Port 5173 is in use
```

**Solução 1:** Fechar aplicação que está usando a porta
```bash
# No Linux/Mac, encontrar e matar o processo
lsof -ti:5173 | xargs kill -9

# No Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

**Solução 2:** Mudar a porta do Vite

Edite `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000 // ou qualquer outra porta livre
  },
  // ... resto da configuração
})
```

---

### 3. ❌ Página em branco no navegador

**Possíveis causas:**

**a) Erro de JavaScript**
1. Abra o Console do navegador (F12 → Console)
2. Procure por erros em vermelho
3. Copie a mensagem de erro e pesquise

**b) Cache do navegador**
- Pressione `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
- Ou limpe o cache: F12 → Application → Clear storage

**c) Build corrompido**
```bash
# Limpar cache do Vite
rm -rf node_modules/.vite

# Reiniciar servidor
npm run dev
```

---

### 4. ❌ Erro de TypeScript

**Erro:**
```
TS2307: Cannot find module...
```

**Solução:**
```bash
# Reinstalar dependências de tipo
npm install --save-dev @types/react @types/react-dom

# Ou regenerar arquivos de tipo
npx tsc --noEmit
```

---

### 5. ❌ Erro ao fazer build para produção

**Erro:**
```
Build failed
```

**Solução:**
```bash
# Limpar e rebuildar
rm -rf dist
npm run build

# Se persistir, verificar erros de tipo
npx tsc --noEmit
```

---

### 6. ❌ CSS não está carregando corretamente

**Sintomas:** Página sem estilo ou estilos quebrados

**Solução:**
```bash
# Verificar se TailwindCSS está instalado
npm list tailwindcss

# Se não estiver, instalar
npm install -D tailwindcss@4.1.12 @tailwindcss/vite@4.1.12

# Reiniciar servidor
npm run dev
```

---

### 7. ❌ React Router não funciona após refresh

**Erro:** Página 404 ao recarregar em rota diferente de "/"

**Causa:** Servidor não está configurado para SPA

**Solução:** Use `npm run dev` durante desenvolvimento (já configurado)

Para produção, configure seu servidor web para redirecionar todas as rotas para index.html

---

### 8. ❌ Ícones Lucide não aparecem

**Solução:**
```bash
# Verificar instalação
npm list lucide-react

# Reinstalar se necessário
npm install lucide-react@latest
```

---

### 9. ❌ AI Assistant não responde

**Causa:** Componente AI Assistant está apenas simulando respostas

**Nota:** Atualmente o AI Assistant usa respostas mockadas. Para IA real:

1. Configure uma API key da OpenAI no arquivo `.env`:
```
VITE_OPENAI_API_KEY=sua_api_key_aqui
```

2. Implemente integração real no arquivo `/src/app/pages/ai-assistant.tsx`

---

### 10. ❌ Tema não está alternando

**Solução:**
```bash
# Verificar se o contexto de tema está funcionando
# Abra o console do navegador e digite:
localStorage.getItem('dualos-theme')

# Limpar localStorage e recarregar
localStorage.clear()
# Recarregar página (F5)
```

---

## 🚨 Erro Crítico: Aplicação não inicia

Se nada funcionar, tente o "reset completo":

```bash
# 1. Backup de arquivos importantes (se houver)

# 2. Limpar tudo
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm package-lock.json  # ou pnpm-lock.yaml

# 3. Limpar cache npm
npm cache clean --force

# 4. Reinstalar Node.js (se necessário)
# Baixe em https://nodejs.org (versão LTS)

# 5. Reinstalar dependências
npm install

# 6. Iniciar novamente
npm run dev
```

---

## 📊 Verificar Sistema

Execute estes comandos para verificar seu ambiente:

```bash
# Versão do Node (deve ser 18+)
node --version

# Versão do npm
npm --version

# Verificar instalação do projeto
npm list --depth=0

# Verificar portas em uso
# Linux/Mac
lsof -i :5173

# Windows
netstat -ano | findstr :5173
```

---

## 🔍 Logs e Debugging

### Ativar modo verbose no Vite:

```bash
npm run dev -- --debug
```

### Ver logs detalhados:

```bash
DEBUG=vite:* npm run dev
```

---

## 📞 Ainda com problemas?

1. **Verificar Issues do GitHub:** Procure por problemas similares
2. **Documentação do Vite:** https://vitejs.dev
3. **Documentação do React:** https://react.dev
4. **Stack Overflow:** Pesquise pelo erro específico

---

## ✅ Checklist de Verificação

Antes de pedir ajuda, confirme:

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm ou pnpm funcionando (`npm --version`)
- [ ] Pasta `node_modules` existe
- [ ] Arquivo `package.json` existe
- [ ] Comando executado na pasta correta do projeto
- [ ] Nenhum outro processo usando porta 5173
- [ ] Firewall/Antivírus não está bloqueando
- [ ] Conexão com internet (para CDNs)

---

## 🆘 Últimos Recursos

### Reinstalação Completa (Windows):
```batch
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

### Reinstalação Completa (Linux/Mac):
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

**Lembre-se:** A maioria dos problemas é resolvida com uma reinstalação limpa das dependências! 🔄
