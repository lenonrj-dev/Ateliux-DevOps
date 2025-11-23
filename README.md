# Ateliux DevOps Dashboard

Painel demo para monitoração, confiabilidade e operações de plataforma, construído com Next.js 15 (App Router) e UI interativa em React 19 + Framer Motion.

## Visão geral
- **Domínios cobertos:** overview de saúde, alertas, deploys, SLOs, tráfego, erros, workloads Kubernetes, pipelines, incidentes, storage, acessos.
- **Dados mockados:** todas as métricas e listas vêm de mocks locais (sem dependência externa), otimizados para demonstração.
- **UI responsiva e animada:** gradientes, microinterações, toasts, pesquisa global simulada e gráficos sparkline.
- **Idiomas e acessibilidade:** rótulos em português, aria-labels preenchidos e placeholders legíveis.

## Arquitetura rápida
- **App Router:** `app/layout.jsx` é server component com metadata e `dynamic = "force-static"`. O shell interativo fica em `components/shell/AppShell.jsx` (client) com Sidebar, Topbar, Toast/Preferences providers.
- **Componentização:** cards e painéis em `components/devops`, gráficos leves em `components/k8s/MiniSpark.jsx`, elementos de shell em `components/shell`.
- **Mocks:** dados em `lib/devops/overview.js` e demais domínios em `lib/`. Páginas (ex.: `app/dashboard/overview/page.jsx`) consomem direto, sem API calls.
- **Estilo:** Tailwind 4 (postcss) com fundo escuro, bordas translúcidas e gradientes; ícones `lucide-react` com otimização de imports.
- **Animações:** Framer Motion para hover/entradas; respeita `prefers-reduced-motion`.

## Otimizações implementadas
- Remoção de hydration mismatch nos sparklines (estado inicial fixo, transições separadas por motion).
- Memoização de gráficos/cards (`memo`), arrays estáticas fora do render.
- `optimizePackageImports` para `lucide-react` no `next.config.mjs`, reduzindo bundle inicial.
- Layout server-only + shell client, permitindo páginas mais estáticas e menos JS crítico.
- Textos corrigidos (acentos/cedilha) e aria labels revisados para acessibilidade.

## Como rodar
1) Instale dependências: `npm install`
2) Desenvolvimento com Turbopack: `npm run dev`
3) Lint: `npm run lint`
4) Build prod com Turbopack: `npm run build`  
5) Start prod: `npm start`

## Estrutura principal
- `app/` — rotas e páginas (App Router).  
- `components/` — UI reutilizável (devops, k8s, shell, ui).  
- `lib/` — dados mockados e utilidades.  
- `public/` — assets estáticos (inclui `logoAteliux.svg` usado na Sidebar).  
- `app/globals.css` — tokens e estilos globais.

## Deploy na Vercel
- Build command: `npm run build`
- Output: `.next/`
- Variáveis: nenhuma obrigatória; dados são mockados.
- Turbo já habilitado (Next 15.5.4), sem config extra.

## Notas de demo
- Sem backend real; todos os botões “executar/aprovar” usam toasts ou alerts simulados.
- Páginas intensivas de UI (overview, workloads, pipelines) foram pensadas para mostrar interatividade, mantendo carregamento rápido com dados locais.
