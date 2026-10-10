
# Plano de Testes — Entrega 3

## Sistema de Gestão e Análise de Recebimento de Cargas

### 1. Objetivo

Verificar o funcionamento das funcionalidades do sistema,
incluindo operações CRUD, autenticação, filtros, Dashboard
e Assistente IA.

### 2. Ambiente de testes

- Backend: Node.js e Express
- Banco de dados: MySQL
- Frontend: HTML, CSS e JavaScript
- Ferramentas: Thunder Client e navegador
- Inteligência artificial: Google Gemini


### 2.1 Rastreabilidade dos requisitos

Cada caso de teste será associado ao requisito funcional
correspondente, conforme a especificação do projeto.

A rastreabilidade permite verificar:

- Se cada requisito possui pelo menos um teste;
- Se os resultados esperados foram atendidos;
- Se existem requisitos sem cobertura;
- Quais funcionalidades precisam de correção.

A identificação dos requisitos seguirá a numeração
original do documento de requisitos.


### 3. Casos de teste

| ID | Funcionalidade | Cenário | Entrada | Resultado esperado | Resultado obtido | Situação |
|---|---|---|---|---|---|---|
| CT-01 | Autenticação | Login com credenciais válidas | E-mail e senha cadastrados | Retornar token JWT | Token retornado | Aprovado |
| CT-02 | Cargas | Cadastrar carga válida | Dados obrigatórios válidos | Carga cadastrada no MySQL | Cadastro realizado | Aprovado |
| CT-03 | Cargas | Número de carga duplicado | Número já cadastrado | Impedir duplicidade | Duplicidade rejeitada | Aprovado |
| CT-04 | Filtros | Consultar cargas por status | Status válido | Retornar cargas correspondentes | Filtro funcionou | Aprovado |
| CT-05 | Dashboard | Consultar total de cargas | GET /dashboard | Retornar total do banco | 5.003 cargas | Aprovado |
| CT-06 | Assistente IA | Perguntar sobre tipos de carga | Pergunta em português | Responder com dados reais | CARGA_SECA: 2.502; CAMARA_FRIA: 2.501 | Aprovado |
| CT-07 | Assistente IA | Exceder limite de requisições | 6 perguntas em menos de 1 minuto | Bloquear requisição excedente | Requisição bloqueada | Aprovado |
| CT-08 | Fornecedores | Cadastrar fornecedor válido | Nome e CNPJ válidos | Fornecedor cadastrado | Cadastro realizado | Aprovado |
| CT-09 | Fornecedores | Consultar fornecedores | GET /fornecedores | Retornar fornecedores cadastrados | Consulta realizada | Aprovado |
| CT-10 | Problemas | Registrar problema em carga existente | ID da carga, tipo e descrição | Problema cadastrado | Cadastro realizado | Aprovado |
| CT-11 | Problemas | Consultar problemas cadastrados | GET /problemas | Retornar problemas existentes | Consulta realizada | Aprovado |
| CT-12 | Cargas | Informar fornecedor inexistente | ID de fornecedor inválido | Rejeitar cadastro | Chave estrangeira inválida rejeitada | Aprovado |
| CT-13 | Filtros | Informar filtro inválido | Parâmetro fora dos valores permitidos | Retornar HTTP 400 | HTTP 400 retornado | Aprovado |
| CT-14 | Filtros | Combinar filtros de cargas | Status, tipo e período | Retornar registros correspondentes | Filtros combinados funcionaram | Aprovado |
| CT-15 | Dashboard | Consultar indicadores com JWT válido | GET /dashboard com token | Retornar indicadores do MySQL | Indicadores retornados | Aprovado |
| CT-16 | Segurança | Acessar Dashboard sem JWT | GET /dashboard sem Authorization | Retornar HTTP 401 | HTTP 401 retornado | Aprovado |
| CT-17 | Cargas | Exclusão lógica de carga | DELETE /cargas/1 com JWT válido | Manter registro no banco com ativo=0 | Carga 1001 preservada com ativo=0 | Aprovado |
| CT-18 | Problemas | Exclusão física de problema | DELETE /problemas/3 com JWT válido | Remover definitivamente o registro da tabela Problema | Registro ID 3 não encontrado após exclusão | Aprovado |
| CT-19 | Segurança | Acessar Dashboard com JWT inválido | GET /dashboard com token inválido | Retornar HTTP 401 e impedir acesso | HTTP 401 retornado | Aprovado |
| CT-20 | RF13 | Filtrar indicadores por período | Data inicial: 2026-10-01; data final: 2026-10-09 | Retornar indicadores apenas das cargas do período | 2 cargas e 32 paletes retornados pela API | Aprovado na API; frontend a confirmar |
| CT-21 | RF13 | Consultar período sem cargas | GET /dashboard/periodo?data_inicio=2020-01-01&data_fim=2020-01-31 com JWT válido | HTTP 200, indicadores numéricos zerados e listas vazias | HTTP 200, indicadores zerados e listas vazias | Aprovado |
| CT-22 | RF13 | Consultar indicadores com datas invertidas | GET /dashboard/periodo?data_inicio=2026-10-10&data_fim=2026-10-01 com JWT válido | HTTP 400, período inválido | HTTP 400, período inválido | Aprovado |
| CT-23 | RF13 | Consultar indicadores com data inexistente | GET /dashboard/periodo?data_inicio=2026-02-30&data_fim=2026-03-10 com JWT válido | HTTP 400, data inválida | HTTP 400, data inválida | Aprovado |
| CT-24 | RF13 | Limpar filtro de período no Dashboard | Selecionar 01/10/2026 a 09/10/2026, clicar em Filtrar período e depois em Limpar filtro | Campos de data limpos e indicadores e gráficos gerais restaurados | Campos de data limpos e indicadores e gráficos gerais restaurados | Aprovado |
| CT-25 | RF13 / RNF04 | Acessar indicadores por período sem autenticação | GET /dashboard/periodo sem token JWT | HTTP 401, acesso negado | HTTP 401, acesso negado após correção do middleware de autenticação | Aprovado |

### 4. Matriz de rastreabilidade dos requisitos funcionais

| RF | Requisito funcional | Casos de teste relacionados | Situação |
|---|---|---|---|
| RF01 | Cadastrar carga | CT-02, CT-03, CT-12 | Testado |
| RF02 | Consultar cargas | A definir | Pendente |
| RF03 | Editar carga | A definir | Pendente |
| RF04 | Excluir carga | CT-17 | Parcial |
| RF05 | Alterar status da carga | A definir | Pendente |
| RF06 | Registrar horários do recebimento | A definir | Pendente |
| RF07 | Calcular tempos do recebimento | A definir | Pendente |
| RF08 | Registrar problemas | CT-10 | Testado |
| RF09 | Classificar problemas | CT-10 | Parcial |
| RF10 | Consultar histórico | A definir | Pendente |
| RF11 | Filtrar cargas | CT-04, CT-13, CT-14 | Testado |
| RF12 | Visualizar Dashboard | CT-05, CT-15 | Testado |
| RF13 | Consultar indicadores por período | CT-20, CT-21, CT-22, CT-23, CT-24, CT-25 | Parcialmente testado |
| RF14 | Consultar informações pelo Assistente IA | CT-06, CT-07 | Testado |

