# Guia de Deployment - DualOS

## 🚀 Deployment para Produção

### Pré-requisitos
- Node.js 18+
- pnpm (gerenciador de pacotes)
- Conta Vercel/Netlify (opcional para hosting)

### Build de Produção

```bash
# Instalar dependências
pnpm install

# Build
pnpm build

# Preview do build
pnpm preview
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente (Futuro)

Criar arquivo `.env` na raiz:

```env
# OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase (quando integrado)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Ambiente
VITE_ENV=production
VITE_API_URL=https://api.dualos.com
```

## 📦 Estrutura de Deployment

```
dist/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.html
```

## 🌐 Deploy em Plataformas

### Vercel

1. Conecte seu repositório GitHub ao Vercel
2. Configure o projeto:
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
3. Adicione variáveis de ambiente no dashboard
4. Deploy!

```bash
# Via CLI
vercel --prod
```

### Netlify

1. Conecte repositório GitHub
2. Configure:
   - Build Command: `pnpm build`
   - Publish Directory: `dist`
3. Adicione variáveis de ambiente
4. Deploy!

```bash
# Via CLI
netlify deploy --prod
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔐 Segurança

### Headers de Segurança (netlify.toml)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'"
```

## ⚡ Otimizações de Performance

### 1. Code Splitting
- React Router já implementa code splitting automático
- Componentes lazy-loaded por rota

### 2. Compressão
```javascript
// vite.config.ts
import compression from 'vite-plugin-compression'

export default {
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ]
}
```

### 3. Análise de Bundle
```bash
pnpm add -D rollup-plugin-visualizer
```

## 📊 Monitoramento (Futuro)

### Analytics
- Google Analytics
- Mixpanel
- Hotjar

### Error Tracking
- Sentry
- LogRocket

### Performance
- Lighthouse CI
- Web Vitals

## 🔄 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🧪 Testes Antes do Deploy

```bash
# Lint
pnpm lint

# Type check
pnpm type-check

# Build test
pnpm build

# Preview
pnpm preview
```

## 📱 PWA (Futuro)

### Service Worker
```javascript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('dualos-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        // ... outros assets
      ]);
    })
  );
});
```

### Manifest
```json
{
  "name": "DualOS",
  "short_name": "DualOS",
  "description": "Personal Operating System",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6A0DAD",
  "background_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔍 SEO

### Meta Tags (index.html)
```html
<meta name="description" content="DualOS - Sistema Operacional Pessoal para Gestão Híbrida">
<meta property="og:title" content="DualOS">
<meta property="og:description" content="Personal Operating System">
<meta property="og:image" content="/og-image.png">
<meta name="twitter:card" content="summary_large_image">
```

## 📈 Checklist de Deploy

- [ ] Build sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Testes passando
- [ ] Lighthouse score > 90
- [ ] Responsividade testada
- [ ] Cross-browser testado
- [ ] SSL/HTTPS configurado
- [ ] Domain configurado
- [ ] Analytics implementado
- [ ] Error tracking configurado
- [ ] Backup configurado

## 🆘 Troubleshooting

### Erro de Build
```bash
# Limpar cache
rm -rf node_modules
rm -rf dist
pnpm install
pnpm build
```

### Problemas de Routing
- Verificar configuração de rewrites no hosting
- Netlify: `_redirects` file
- Vercel: `vercel.json`

### Performance Issues
- Verificar bundle size
- Implementar lazy loading
- Otimizar imagens
- Habilitar caching

## 📞 Suporte

- Email: suporte@dualos.com
- Docs: https://docs.dualos.com
- Issues: https://github.com/dualos/issues

---

**DualOS** - Sistema Operacional Pessoal
Versão 1.0.0 - Build 2026-03-31
