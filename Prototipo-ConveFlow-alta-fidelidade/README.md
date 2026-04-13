# ConvEasy Frontend

Interface moderna e responsiva para o sistema de gerenciamento de convênios ConvEasy, desenvolvida com React 18 e tecnologias de ponta.

## Visão Geral

Este é o frontend do ConvEasy, uma aplicação web moderna que oferece uma experiência intuitiva para gerenciamento de convênios, empresas e documentos. O projeto foi desenvolvido a partir do protótipo de alta fidelidade disponível no [Figma](https://www.figma.com/design/N8ykMWxgeNVwMwAOUy4azP/Prototipo-ConveFlow-alta-fidelidade).

## Tecnologias

- **React 18.3.1** - Biblioteca principal de interface
- **Vite 6.3.5** - Build tool e servidor de desenvolvimento
- **TypeScript** - Tipagem estática (em implementação)
- **TailwindCSS 4.1.12** - Framework de estilização
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Router 7.13.0** - Sistema de roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Supabase JS** - Cliente do banco de dados e autenticação
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Biblioteca de gráficos
- **Sonner** - Sistema de notificações toast

## Funcionalidades

- **Dashboard Interativo** com métricas em tempo real
- **Gestão de Convênios** com formulários inteligentes
- **Cadastro e Edição de Empresas** com validação de CNPJ
- **Sistema de Upload de Documentos** com preview
- **Busca e Filtragem Avançada**
- **Notificações em Tempo Real**
- **Tema Dark/Light**
- **Interface Responsiva** para todos os dispositivos
- **Acessibilidade WCAG 2.1**

## Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase configurada

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd Conveasy/Prototipo-ConveFlow-alta-fidelidade
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Crie o arquivo .env.local
   echo "VITE_SUPABASE_URL=https://seu-projeto.supabase.co" > .env.local
   echo "VITE_SUPABASE_ANON_KEY=sua-chave-publica" >> .env.local
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## Estrutura do Projeto

```
src/
|
|--- components/           # Componentes reutilizáveis
|   |--- ui/              # Componentes UI base (shadcn/ui)
|   |--- forms/           # Componentes de formulário
|   |--- charts/          # Componentes de gráficos
|   |--- layout/          # Componentes de layout
|
|--- pages/               # Páginas principais
|   |--- Dashboard.tsx
|   |--- Convenios.tsx
|   |--- Empresas.tsx
|   |--- Usuarios.tsx
|
|--- hooks/               # Custom hooks
|   |--- useAuth.ts
|   |--- useConvenios.ts
|   |--- useEmpresas.ts
|
|--- services/            # Serviços de API
|   |--- api.ts
|   |--- supabase.ts
|
|--- utils/               # Utilitários
|   |--- validators.ts
|   |--- formatters.ts
|
|--- types/               # Definições de tipos TypeScript
|   |--- convenio.ts
|   |--- empresa.ts
|   |--- usuario.ts
|
|--- styles/              # Estilos globais
|   |--- globals.css
|
|--- App.tsx              # Componente principal
|--- main.tsx             # Ponto de entrada
```

## Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executar testes (quando implementados)
npm test

# Verificar código com ESLint
npm run lint

# Verificar tipos TypeScript
npm run type-check
```

## Componentes Principais

### Dashboard

Componente principal que exibe métricas e estatísticas do sistema:
- Total de convênios ativos
- Empresas parceiras
- Documentos recentes
- Alertas pendentes

### Formulários

Formulários inteligentes com validação em tempo real:
- **ConvenioForm**: Cadastro e edição de convênios
- **EmpresaForm**: Cadastro e edição de empresas
- **UsuarioForm**: Gestão de usuários

### Tabelas

Componentes de tabela com funcionalidades avançadas:
- Paginação
- Ordenação
- Filtros
- Busca
- Ações em lote

## Configuração

### Variáveis de Ambiente

```bash
# .env.local
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
VITE_API_URL=http://localhost:8000
```

### Tema

O sistema suporta temas claro e escuro:
- Controle automático baseado nas preferências do sistema
- Alternador manual no menu
- Persistência da preferência

## Desenvolvimento

### Adicionando Novos Componentes

1. Crie o componente em `src/components/`
2. Use o padrão de componentes do shadcn/ui
3. Adicione tipos TypeScript em `src/types/`
4. Crie hooks personalizados em `src/hooks/` se necessário

### Estilo

- Use TailwindCSS para estilos
- Siga o design system do projeto
- Mantenha consistência visual
- Priorize acessibilidade

### Testes

```bash
# Executar testes unitários
npm test

# Verificar cobertura
npm run test:coverage
```

## Deploy

### Build de Produção

```bash
# Build otimizado
npm run build

# Preview local
npm run preview
```

### Deploy em Produção

O conteúdo da pasta `dist/` pode ser deployado em:
- Vercel
- Netlify
- GitHub Pages
- Servidor web tradicional

## Contribuição

Leia o arquivo [CONTRIBUTING.md](../CONTRIBUTING.md) para diretrizes de contribuição.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para detalhes.

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório.

---

**Desenvolvido com :heart: para o setor TEIA da UNDB**