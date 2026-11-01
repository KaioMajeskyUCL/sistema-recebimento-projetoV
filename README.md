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


### Segurança e autenticação

- Tela de cadastro de usuários integrada à API.
- Tela de login com autenticação JWT.
- Armazenamento seguro de senhas utilizando bcrypt.
- Atribuição automática do perfil `AUXILIAR_ADMINISTRATIVO` no cadastro público.
- Proteção das rotas privadas da API.
- Redirecionamento de usuários não autenticados para o login.
- Botão de logout nas páginas principais.
- Encerramento da sessão no navegador ao realizar logout.
- Validação de tokens JWT ausentes, inválidos ou expirados.
- Limitação de requisições ao Assistente de IA.


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
- Git
- Chave de API do Google Gemini (necessária para utilizar o Assistente de IA)

### Instalação

**1. Clonar o repositório**

```bash
git clone https://github.com/KaioMajeskyUCL/sistema-recebimento-projetoV.git
cd sistema-recebimento-projetoV
```

**2. Preparar o banco de dados**

No MySQL Workbench, execute os scripts na seguinte ordem:

1. `database/schema.sql` — cria o banco de dados e suas tabelas.
2. `database/seed.sql` — insere fornecedores, cargas e problemas de demonstração.

O banco criado terá o nome `sistema_recebimento`.

**Atenção:** o arquivo `schema.sql` contém `DROP DATABASE IF EXISTS`. Sua execução remove o banco existente e todos os seus dados. Utilize-o somente em uma instalação nova ou em um ambiente descartável.

**3. Instalar as dependências**

Acesse a pasta do backend:

```bash
cd backend
npm install
```

**4. Configurar as variáveis de ambiente**

Crie o arquivo `.env` na pasta `backend`, utilizando `.env.example` como referência.

Configure as variáveis de conexão com o MySQL, a chave de autenticação JWT e a chave da API Gemini, conforme as variáveis utilizadas pelo projeto.

Para o banco criado pelo script SQL, utilize:

```env
DB_NAME=sistema_recebimento
```

Não publique o arquivo `.env` nem credenciais reais no GitHub.

**5. Iniciar o servidor**

```bash
npm run dev
```


### 6. Cadastrar um usuário

Com o servidor em execução, acesse:

http://localhost:3000/frontend/cadastro.html

Preencha o formulário com:
- Nome completo
- E-mail
- Senha
- Confirmação da senha

Após o cadastro, o usuário será redirecionado para a tela de login.

Por segurança, os usuários cadastrados pela interface recebem automaticamente o perfil `AUXILIAR_ADMINISTRATIVO`.

O sistema utiliza bcrypt para armazenar as senhas em formato de hash.

O perfil `ENCARREGADO` não pode ser selecionado pelo cadastro público. Sua atribuição exige um procedimento administrativo autorizado.


Utilize a rota:

```http
POST http://localhost:3000/auth/cadastro
Content-Type: application/json

{
  "nome": "Usuario Demonstracao",
  "email": "demo@exemplo.com",
  "senha": "SENHA_ESCOLHIDA_PELO_USUARIO",
  "perfil": "ENCARREGADO"
}
```

O sistema utiliza bcrypt para armazenar o hash da senha.

**7. Realizar login**

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "demo@exemplo.com",
  "senha": "SENHA_ESCOLHIDA_PELO_USUARIO"
}
```

Após a autenticação, a API retorna um token JWT que deve ser enviado nas requisições protegidas.

**8. Acessar a interface Web**

Com o servidor em execução, acesse:

http://localhost:3000/frontend/login.html

O endereço acima pressupõe a configuração de arquivos estáticos utilizada no ambiente de desenvolvimento.

### Dados iniciais de demonstração

O script `seed.sql` disponibiliza:

| Dados | Quantidade |
|---|---:|
| Fornecedores | 3 |
| Cargas | 8 |
| Tipos de problemas | 7 |
| Problemas registrados | 2 |

Os sete tipos de problemas são inseridos pelo `schema.sql`.

O cadastro do primeiro usuário é realizado separadamente pela API.

## Documentação

A documentação técnica do projeto está organizada na pasta `documentacao/`, reunindo os registros de implementação, testes e evolução do sistema ao longo das entregas do Projeto Interdisciplinar V.

### Documentação técnica

- `cruds-validacoes.md` — implementação das operações CRUD e validações.
- `indicadores-dashboard.md` — indicadores gerenciais e consultas utilizadas no Dashboard.
- `integracao-ia.md` — integração com o Google Gemini e funcionamento do Assistente de IA.
- `analise-desempenho.md` — análise de desempenho das consultas SQL.
- `plano-testes.md` — planejamento, execução e resultados dos testes.
- `alteracoes-entrega3.md` — registro das alterações realizadas na terceira entrega.

### Documentação final

A Entrega 4 contempla também:

- Relatório final consolidado, reunindo as etapas do projeto.
- Manual do usuário com orientações e capturas de tela.
- Registro das revisões realizadas ao longo das entregas.
- Matriz de rastreabilidade entre requisitos, implementação e testes.
- Vídeo demonstrativo do sistema em funcionamento.

Os documentos finais serão disponibilizados junto aos demais materiais da entrega, conforme sua conclusão.