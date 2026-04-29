# Requisitos para Produção: Óculos Solidários (Stack Supabase + Vercel)

Este documento detalha os requisitos críticos, falhas na arquitetura atual e o plano de ação necessário para transformar a atual Prova de Conceito (PoC) do projeto "Óculos Solidários" em uma aplicação de produção, focando especificamente na adoção do ecossistema **Supabase** (Backend-as-a-Service) e **Vercel** (Hospedagem e Edge Computing).

---

## 1. Autenticação e Gestão de Usuários
**Estado Atual:** Fluxo de login simulado no `LoginView.tsx`, salvo em memória via Zustand.
**Implementação com Supabase:**
- **Supabase Auth:** Substituir o sistema atual pelo cliente de autenticação do Supabase.
- **Tipos de Login:** Habilitar *Magic Links* (login por email sem senha) para maior facilidade para o público-alvo, além de Social Login (Google).
- **Validação:** Exigir validação de email via Supabase para mitigar perfis falsos. As sessões (JWT) serão automaticamente gerenciadas pelo SDK do Supabase de forma segura.

## 2. Banco de Dados e Persistência
**Estado Atual:** Dados vivem no estado global (`useStore.ts`) e no `mockData.ts`.
**Implementação com Supabase:**
- **PostgreSQL (Supabase DB):** Migrar as interfaces TypeScript para tabelas relacionais (`users`, `ads`, `prescription_requests`, `ratings`, `chats`, `messages`).
- **Row Level Security (RLS):** **Critico.** Como o Supabase permite chamadas diretas do frontend pro banco de dados, é obrigatório configurar RLS. Exemplo: um usuário só pode editar ou deletar um `ad` (anúncio) se o `user_id` da linha for igual ao `auth.uid()`.
- **Filtros Diretos:** O SDK do Supabase substituirá o Zustand para buscas, lidando facilmente com paginação e filtros diretamente do banco.

## 3. Upload e Armazenamento de Arquivos
**Estado Atual:** Imagens com URLs "chumbadas" do Unsplash.
**Implementação com Supabase:**
- **Supabase Storage:** Criar *Buckets* distintos. Um bucket público (`public-glasses`) para as fotos dos óculos, e um bucket privado (`private-prescriptions`) para as receitas médicas e documentos.
- **Segurança (LGPD):** O bucket de receitas deve possuir políticas de RLS onde apenas o paciente e o "padrinho" (após a conexão) podem gerar URLs assinadas para ver os documentos.

## 4. Arquitetura de Backend e APIs
**Estado Atual:** Um servidor Express simples (`server.ts`) rodando junto com o frontend para expor a rota da IA.
**Implementação com Vercel:**
- **Vercel Serverless Functions:** Descartar o Express. A rota de moderação com o `@google/genai` deve ser migrada para uma `Serverless Function` na Vercel (pasta `/api/moderate.ts`). Isso garante escalabilidade automática e zero configuração de servidor.
- Dessa forma, o projeto se torna 100% focado no frontend, comunicando-se com o Supabase (dados) e com a Vercel (funções específicas que requerem segredo, como a API Key do Gemini).

## 5. Comunicação em Tempo Real (Chat)
**Estado Atual:** Chat mockado, sem sincronização real.
**Implementação com Supabase:**
- **Supabase Realtime:** Ativar o Realtime nas tabelas de `messages` e `chats`. O frontend vai "escutar" (subscribe) inserções no banco de dados, atualizando a interface instantaneamente sem necessidade de WebSockets customizados ou servidores externos.

## 6. Geolocalização e Mapas
**Estado Atual:** Endereços em texto (Cidade, Estado).
**Implementação com Supabase:**
- **PostGIS:** O PostgreSQL do Supabase possui suporte nativo à extensão PostGIS.
- Converter endereços em coordenadas na criação do anúncio e usar funções de raio do PostGIS (ex: `ST_DWithin`) para alimentar o `MapOverlay.tsx` apenas com óculos num raio de X km do usuário, resolvendo o problema de escala do mapa.

## 7. Infraestrutura e CI/CD
**Estado Atual:** Rodando via localhost local.
**Implementação com Vercel:**
- Hospedar o frontend React (Vite) diretamente na **Vercel**.
- **CI/CD Automático:** Integrar o repositório do GitHub com a Vercel. Cada *push* na *main* gerará um deploy em produção instantâneo.
- Variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`) serão todas gerenciadas no painel da Vercel.

---

## 🌟 Recomendações Estratégicas Extras

Como você está optando por **Vercel + Supabase**, aqui estão as melhores práticas que você deve considerar para levar o projeto pro próximo nível:

1. **Migração de Vite (React puro) para Next.js (App Router)**
   * **Por que?** A Vercel é a criadora do Next.js. Hospedar um app Vite na Vercel é bom, mas hospedar um Next.js libera "superpoderes".
   * **SEO:** Anúncios de óculos poderão ser compartilhados nas redes sociais com a foto e título corretos (Open Graph), pois o Next.js fará a renderização no servidor (SSR). O Vite (SPA) tem péssimo SEO para links compartilhados.
   * **Segurança da IA:** O código de moderação do Gemini rodará em um *Server Action* nativo do Next.js, dispensando completamente a necessidade de gerenciar rotas `/api` separadas ou servidores Express.

2. **Gerenciamento de Estado Simplificado**
   * Ao utilizar o cliente do Supabase (ou SWR / React Query em conjunto), a necessidade do Zustand (`useStore.ts`) cai drasticamente. Você passará a usar o banco de dados como fonte da verdade, armazenando no estado global apenas coisas pequenas de UI (ex: abas ativas).

3. **Supabase Database Webhooks**
   * Em vez de fazer o frontend chamar a moderação de IA antes de salvar no banco, você pode usar um *Webhook* do Supabase. O usuário salva o anúncio com status `review`. O Supabase notifica a Vercel, a Vercel roda a IA do Gemini em background e atualiza o status para `active` ou `blocked`. Isso tira a lentidão de espera do usuário e melhora drasticamente a UX.
