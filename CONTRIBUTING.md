# Contribuindo para o ConvEasy

Obrigado pelo seu interesse em contribuir para o ConvEasy! Este guia irá ajudá-lo a começar.

## Como Contribuir

### 1. Fork o Repositório

1. Vá para o repositório principal do ConvEasy
2. Clique no botão "Fork" no canto superior direito
3. Clone seu fork localmente:

```bash
git clone https://github.com/seu-usuario/Conveasy.git
cd Conveasy
```

### 2. Configure seu Ambiente

Siga as instruções no README.md principal para configurar o ambiente de desenvolvimento.

### 3. Crie uma Branch

Crie uma branch para sua contribuição:

```bash
# Para uma nova funcionalidade
git checkout -b feature/nova-funcionalidade

# Para uma correção de bug
git checkout -b fix/correcao-do-bug

# Para melhoria de documentação
git checkout -b docs/atualizacao-documentacao
```

### 4. Faça suas Alterações

- **Backend**: Siga a estrutura de pastas existente em `conveasy-backend/app/`
- **Frontend**: Siga a estrutura de pastas existente em `Prototipo-ConveFlow-alta-fidelidade/src/`
- **Testes**: Adicione testes para novas funcionalidades

### 5. Teste suas Alterações

#### Backend

```bash
cd conveasy-backend

# Execute os testes
pytest tests/ -v --cov=app --cov-report=html

# Verifique a cobertura de código
open htmlcov/index.html
```

#### Frontend

```bash
cd Prototipo-ConveFlow-alta-fidelidade

# Inicie o servidor de desenvolvimento
npm run dev

# Teste a aplicação no navegador
```

### 6. Commit suas Alterações

Use mensagens de commit claras e descritivas:

```bash
# Adicione suas alterações
git add .

# Faça o commit
git commit -m "feat: adiciona nova funcionalidade de busca de convênios"
```

#### Padrão de Mensagens de Commit

Usamos o padrão Conventional Commits:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Atualização de documentação
- `style:` Alterações de formatação/código
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Alterações de build/dependências

### 7. Push para seu Fork

```bash
git push origin feature/nova-funcionalidade
```

### 8. Abra um Pull Request

1. Vá para seu fork no GitHub
2. Clique em "New Pull Request"
3. Preencha o template do PR com:
   - Descrição clara das alterações
   - Passos para testar
   - Screenshots se aplicável
   - Issues relacionadas

## Diretrizes de Código

### Backend (Python/FastAPI)

#### Estilo de Código
- Siga o [PEP 8](https://pep8.org/)
- Use type hints sempre que possível
- Mantenha funções pequenas e focadas

#### Estrutura
```python
# Exemplo de endpoint
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.convenio import ConvenioCreate, ConvenioResponse
from app.services.convenio_service import ConvenioService

router = APIRouter()

@router.post("/", response_model=ConvenioResponse)
async def create_convenio(
    convenio: ConvenioCreate,
    service: ConvenioService = Depends()
) -> ConvenioResponse:
    """Cria um novo convênio."""
    try:
        return await service.create_convenio(convenio)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

#### Testes
- Escreva testes para todas as novas funcionalidades
- Use fixtures quando apropriado
- Mantenha cobertura de código acima de 80%

### Frontend (React/TypeScript)

#### Estilo de Código
- Use TypeScript para novo código
- Siga as convenções do React Hooks
- Mantenha componentes pequenos e reutilizáveis

#### Estrutura
```tsx
// Exemplo de componente
import React from 'react';
import { Button } from '@/components/ui/button';
import { useConvenios } from '@/hooks/useConvenios';

interface ConvenioListProps {
  onEdit: (id: string) => void;
}

export const ConvenioList: React.FC<ConvenioListProps> = ({ onEdit }) => {
  const { convenios, loading, error } = useConvenios();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {convenios.map(convenio => (
        <div key={convenio.id} className="border rounded p-4">
          <h3>{convenio.nome}</h3>
          <Button onClick={() => onEdit(convenio.id)}>
            Editar
          </Button>
        </div>
      ))}
    </div>
  );
};
```

## Relatório de Issues

### Bugs
- Use o template de bug report
- Inclua passos para reproduzir
- Adicione screenshots se possível
- Especifique ambiente (SO, navegador, versão)

### Funcionalidades
- Descreva claramente o que deseja
- Explique o caso de uso
- Considere alternativas

## Processo de Code Review

### Para Reviewers
- Verifique conformidade com as diretrizes
- Teste as alterações funcionalmente
- Verifique cobertura de testes
- Seja construtivo nos comentários

### Para Contributors
- Responda a todos os comentários
- Faça as alterações solicitadas
- Mantenha o PR atualizado
- Seja paciente e profissional

## Release Process

1. **Versionamento**: Usamos [Semantic Versioning](https://semver.org/)
2. **Changelog**: Mantemos um changelog detalhado
3. **Tags**: Criamos tags para cada release
4. **Deploy**: Deploy automatizado via CI/CD

## Comunidade

### Canais de Comunicação
- **GitHub Issues**: Para bugs e funcionalidades
- **Discussions**: Para dúvidas e discussões
- **Email**: Para assuntos privados

### Conduta de Código

Seja respeitoso e profissional:
- Use linguagem inclusiva
- Seja construtivo em feedbacks
- Ajude outros contributors
- Mantenha foco no que é melhor para o projeto

## Recursos

### Documentação
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Supabase Documentation](https://supabase.com/docs)

### Ferramentas
- **VS Code**: Editor recomendado
- **Postman/Insomnia**: Para testar APIs
- **Git**: Controle de versão
- **Docker**: Containerização

## Agradecimentos

Agradecemos a todos que contribuem para o ConvEasy! Sua ajuda é fundamental para o sucesso do projeto.

---

Se tiver alguma dúvida, não hesite em abrir uma issue ou entrar em contato conosco.
