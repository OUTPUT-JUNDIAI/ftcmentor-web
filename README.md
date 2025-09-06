# FIRST® Tech Challenge Mentor Platform

Uma plataforma PWA completa para conectar equipes FIRST® Tech Challenge com mentores especialistas em STEAM, facilitando o matching, agendamento e acompanhamento de sessões de mentoria.

## 🚀 Funcionalidades

### Para Equipes
- ✅ Cadastro e onboarding personalizado
- ✅ Busca inteligente de mentores com sistema de scoring
- ✅ Solicitação e gerenciamento de conexões
- ✅ Agendamento de sessões integrado
- ✅ Sistema de feedback e avaliação NPS
- ✅ Dashboard com métricas pessoais

### Para Mentores
- ✅ Perfil detalhado com competências e disponibilidade
- ✅ Recebimento e gestão de solicitações
- ✅ Agenda de sessões e histórico
- ✅ Sistema de avaliação bidirecional
- ✅ Dashboard com visão das equipes mentoradas

### Para Administradores
- ✅ Dashboard com métricas da plataforma
- ✅ Moderação e aprovação de mentores
- ✅ Sistema de denúncias e resolução
- ✅ Configuração de pesos do algoritmo de matching
- ✅ Relatórios e analytics

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Estado**: Zustand para gerenciamento de estado
- **Formulários**: React Hook Form + Zod para validação
- **HTTP**: Axios com interceptors para JWT
- **Charts**: Recharts para visualizações
- **Notificações**: Sonner para toasts
- **Tema**: next-themes para dark/light mode

## 🏗️ Arquitetura

```
├── app/                    # Next.js App Router
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── layout/           # Componentes de layout
├── lib/                  # Utilitários e configurações
│   ├── stores/          # Stores Zustand
│   ├── services/        # Camada de API (mock + real)
│   └── constants.ts     # Constantes da aplicação
├── mocks/               # Dados de fixture (JSON)
├── types/               # Types TypeScript + Zod schemas
└── hooks/               # Custom hooks
```

## 🚦 Como Executar

### 1. Instalação
```bash
npm install
```

### 2. Configuração do Ambiente
Copie o arquivo `.env.local` e configure as variáveis:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_USE_API=false  # true para API real, false para mocks

# External Integrations
NEXT_PUBLIC_CALENDLY_ORIGIN=https://calendly.com
NEXT_PUBLIC_GOOGLE_CALENDAR_URL=https://calendar.google.com

# App Configuration
NEXT_PUBLIC_APP_NAME=FIRST® Tech Challenge Mentor Platform
NEXT_PUBLIC_DEFAULT_LOCALE=pt-BR
```

### 3. Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

### 4. Build para Produção
```bash
npm run build
npm start
```

## 🔄 Alternando entre Mock e API Real

### Modo Mock (Desenvolvimento)
```env
NEXT_PUBLIC_USE_API=false
```
- Usa dados dos arquivos `/mocks/*.json`
- Simula latência de rede
- Permite desenvolvimento offline
- Algoritmo de matching implementado no frontend

### Modo API (Produção)
```env
NEXT_PUBLIC_USE_API=true
```
- Conecta com API Rails real
- JWT com refresh automático
- Interceptors configurados
- Matching via endpoint dedicado

## 🔗 Integração com API Rails

### Endpoints Esperados

#### Autenticação
```
POST /auth/login
POST /auth/register  
POST /auth/refresh
```

#### Entidades
```
GET/POST/PUT /teams
GET/POST/PUT /mentors
GET/POST/PUT /matches  
GET/POST/PUT /sessions
GET/POST /feedback
GET/POST/PUT /reports
```

#### Matching
```
POST /matching/suggest
Body: { teamId: string }
Response: { mentor, score, factors }[]
```

#### Métricas
```
GET /metrics
Response: { totalTeams, totalMentors, avgNPS, ... }
```

### Headers Necessários
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 🧮 Algoritmo de Matching

O sistema usa ponderação configurable para calcular compatibilidade:

```typescript
const weights = {
  area: 0.4,        // Áreas STEAM
  schedule: 0.25,   // Disponibilidade
  language: 0.15,   // Idioma
  modality: 0.1,    // Online/Presencial
  region: 0.1       // Localização
}
```

### Como Customizar Pesos
1. Acesse `/admin/settings` como administrador
2. Ajuste os pesos usando os sliders
3. As mudanças são aplicadas imediatamente

## 👥 Contas de Demonstração

Use essas credenciais para testar:

```
Equipe:
Email: ana@exemplo.com.br
Senha: demo123

Mentor: 
Email: carlos@exemplo.com.br
Senha: demo123

Admin:
Email: admin@ftcmentors.com.br  
Senha: admin123
```

## 🔒 Conformidade LGPD

- ✅ Consentimento explícito no cadastro
- ✅ Minimização de dados coletados
- ✅ Termos de uso e política de privacidade
- ✅ Sistema de denúncias para moderação
- ✅ Controles de privacidade no perfil

## 🌐 PWA Features

- ✅ Installable (Add to Home Screen)
- ✅ Offline-ready service worker
- ✅ Responsive design (mobile-first)
- ✅ Theme-color and meta tags
- ✅ App-like navigation

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📝 Linting e Formatação

```bash
# ESLint
npm run lint
npm run lint:fix

# Prettier  
npm run format
```

## 🎨 Design System

### Cores Primárias
```css
--brand-primary: #D9043D    /* ThoughtWorks Red */
--brand-accent: #F2B705     /* Accent Yellow */
--brand-warm: #F28705       /* Warm Orange */
--ink-900: #363432          /* Dark Gray */
--violet-600: #72588C       /* Accent Purple */
```

### Typography
- **Font**: Inter (fallback: system-ui, sans-serif)
- **Scales**: Tailwind default (sm, base, lg, xl, 2xl, etc.)
- **Line Heights**: 150% for body, 120% for headings

## 🚨 Importante: Escopo da Plataforma

⚠️ **Esta plataforma NÃO é oficial do FTC**

- ❌ Não substitui canais oficiais do FIRST Tech Challenge
- ❌ Não gerencia inscrições em competições
- ❌ Não fornece informações oficiais sobre regras/eventos
- ✅ Foca exclusivamente em mentoria e formação de equipes

Sempre consulte os canais oficiais do FIRST® Tech Challenge para informações sobre competições.

## 📚 Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev)
- [Zustand State Management](https://zustand-demo.pmnd.rs)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.