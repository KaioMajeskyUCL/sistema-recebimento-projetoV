# Sistema de Gestão e Análise de Recebimento de Cargas

Projeto desenvolvido para a disciplina **Projeto Interdisciplinar V**, do curso de Análise e Desenvolvimento de Sistemas da Faculdade UCL.

## Sobre o projeto

O sistema tem como objetivo auxiliar o gerenciamento do processo de recebimento de cargas em um centro de distribuição, permitindo registrar, acompanhar e analisar informações relacionadas às operações de recebimento.

A aplicação oferece funcionalidades para controle de cargas, fornecedores e problemas operacionais, além de indicadores gerenciais e um Assistente de Inteligência Artificial.

## Funcionalidades

### Gestão de cargas
- Cadastro, consulta e edição de cargas
- Exclusão lógica de registros
- Alteração de status das cargas
- Registro dos horários de chegada, docagem e finalização
- Histórico automático das alterações de status
- Identificação do usuário responsável pelas alterações
- Filtros avançados e paginação

### Gestão de fornecedores e problemas
- Cadastro, consulta, edição e exclusão lógica de fornecedores
- Cadastro, consulta, edição e exclusão de problemas
- Classificação de problemas operacionais

### Dashboard analítico
- Total de cargas e paletes
- Tempo médio de espera e descarga
- Distribuição de cargas por tipo e fornecedor
- Quantidade de cargas com problemas
- Distribuição dos problemas por categoria
- Filtragem dos indicadores por período
- Gráficos interativos utilizando Chart.js

### Assistente de Inteligência Artificial
- Integração com a API Google Gemini
- Perguntas em linguagem natural
- Respostas contextualizadas com indicadores gerais do Dashboard
- Limitação de requisições para controle de consumo

### Segurança
- Cadastro e autenticação de usuários
- Armazenamento de senhas com bcrypt
- Autenticação utilizando JSON Web Token (JWT)
- Proteção das rotas privadas da API

## Tecnologias utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js

### Backend
- Node.js
- Express
- MySQL2
- Google GenAI SDK

### Banco de dados
- MySQL

### Segurança
- bcrypt
- JSON Web Token (JWT)
- express-rate-limit

### Desenvolvimento e versionamento
- Visual Studio Code
- MySQL Workbench
- Git e GitHub

## Arquitetura

O backend utiliza uma arquitetura em camadas, com separação de responsabilidades entre rotas, controllers, services e repositories.

Fluxo principal:

```text
Frontend (HTML, CSS e JavaScript)
             |
             v
       API REST (Express)
             |
             v
           Routes
             |
             v
         Controllers
             |
             v
          Services
             |
             v
        Repositories
             |
             v
           MySQL
```

A integração com o Google Gemini é realizada pelo backend.

## Principais endpoints

| Método | Endpoint | Finalidade |
|---|---|---|
| GET | `/cargas` | Consultar cargas |
| POST | `/cargas` | Cadastrar carga |
| GET | `/cargas/:id` | Consultar carga específica |
| PATCH | `/cargas/:id/status` | Alterar status |
| GET | `/cargas/:id/historico` | Consultar histórico |
| GET | `/fornecedores` | Consultar fornecedores |
| POST | `/fornecedores` | Cadastrar fornecedor |
| GET | `/problemas` | Consultar problemas |
| GET | `/tipos-problema` | Consultar categorias |
| GET | `/dashboard` | Consultar indicadores gerais |
| GET | `/dashboard/periodo` | Consultar indicadores por período |
| POST | `/assistente/perguntar` | Enviar pergunta ao Assistente de IA |

As rotas protegidas exigem autenticação JWT.

## Execução do projeto

### Pré-requisitos
- Node.js e npm
- MySQL
- Chave de API do Google Gemini para utilizar o Assistente de IA

### Configuração

1. Clone o repositório.
2. Crie o banco de dados utilizando o script `database/schema.sql`.
3. Acesse a pasta `backend`.
4. Instale as dependências com `npm install`.
5. Configure as variáveis de ambiente tomando como referência o arquivo `.env.example`.
6. Inicie o servidor com `npm run dev`.

A interface Web pode ser acessada pelo endereço:

`http://localhost:3000/frontend/index.html`

**Atenção:** o script SQL inicial pode recriar o banco de dados. Não o execute sobre uma base com dados que precisem ser preservados.

## Documentação

Os detalhes de implementação e validação da Entrega 3 estão disponíveis na pasta `documentacao/`:

- `cruds-validacoes.md`
- `indicadores-dashboard.md`
- `integracao-ia.md`
- `analise-desempenho.md`
- `plano-testes.md`
- `alteracoes-entrega3.md`

## Limitações conhecidas

- O Assistente de IA utiliza indicadores gerais do Dashboard e ainda não executa consultas automáticas por períodos específicos mencionados nas perguntas.
- O controle de permissões específicas por perfil de usuário ainda necessita de validação completa.
- Os resultados dos testes de desempenho não demonstraram ganho significativo de velocidade com o índice SQL avaliado.

## Contexto acadêmico

O projeto foi desenvolvido de forma incremental durante a disciplina Projeto Interdisciplinar V, contemplando levantamento de requisitos, modelagem de dados, implementação, integração, testes e documentação técnica.