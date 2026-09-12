# Sistema de Gestão de Recebimento de Cargas

Projeto desenvolvido para a disciplina Projeto Interdisciplinar V.

O sistema tem como objetivo auxiliar o gerenciamento do processo de recebimento de cargas em um centro de distribuição, permitindo registrar, acompanhar e consultar informações relacionadas às cargas recebidas.

## Funcionalidades

- Cadastro de cargas
- Consulta de cargas
- Edição de cargas
- Exclusão de cargas
- Alteração de status das cargas
- Registro automático do histórico de status
- Consulta do histórico das cargas
- Cadastro de usuários
- Login de usuários
- Autenticação utilizando JWT
- Proteção de rotas da API
- Registro do usuário responsável pelas alterações de status

## Tecnologias

### Frontend
- React

### Backend
- Node.js
- Express

### Banco de Dados
- MySQL

### Segurança
- bcrypt
- JSON Web Token (JWT)

## Arquitetura

O backend utiliza uma arquitetura em camadas baseada no padrão MVC, complementada por Services e Repositories.

Fluxo principal:

Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
MySQL