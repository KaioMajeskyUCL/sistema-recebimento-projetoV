
# Alterações realizadas na Entrega 3

## 1. Evolução do projeto

Durante a Entrega 3, o Sistema de Gestão e Análise de
Recebimento de Cargas passou da estruturação inicial
do banco de dados e dos endpoints para uma aplicação
com operações de gestão, indicadores e integração com IA.

## 2. Tabela de alterações

| Elemento | Planejamento anterior | Implementação na Entrega 3 | Justificativa |
|---|---|---|---|
| Frontend | React | HTML, CSS e JavaScript | Simplificar o desenvolvimento e a integração com a API |
| Cargas | Endpoints iniciais | CRUD com validações, filtros e paginação | Completar as operações de gerenciamento |
| Fornecedores | Gestão não prevista no escopo inicial | CRUD de fornecedores | Permitir o gerenciamento dos fornecedores vinculados às cargas |
| Problemas | Registro e classificação previstos | CRUD e categorias cadastradas no banco | Organizar o tratamento das ocorrências |
| Histórico | Consulta prevista | Registro de alterações de status | Melhorar a rastreabilidade |
| Dashboard | Indicadores planejados | Oito indicadores calculados por SQL | Apoiar decisões sobre o recebimento |
| Filtros | Pesquisa de cargas prevista | Filtros combinados e paginação | Facilitar consultas em grandes volumes |
| Desempenho | Requisito de eficiência | Índice SQL e análise com EXPLAIN ANALYZE | Avaliar o acesso aos dados |
| Inteligência artificial | Assistente planejado | Integração com API Gemini | Responder perguntas sobre indicadores reais |
| Segurança | Controle de acesso previsto | Autenticação JWT e senhas com hash | Restringir o acesso às funcionalidades |
| Controle de uso da IA | Não detalhado | Limite de cinco perguntas por minuto | Reduzir o risco de uso excessivo da API |
| Indicadores por período | RF13 previsto | Filtro de datas no backend e frontend | Permitir análises de intervalos específicos |

## 3. Observações

A alteração de React para HTML, CSS e JavaScript
não modifica os objetivos funcionais do sistema,
mas representa uma mudança na tecnologia de frontend.

A gestão de fornecedores foi incorporada ao escopo
implementado para apoiar o cadastro e a consulta de cargas.

A análise de desempenho do índice SQL não demonstrou
ganho significativo no conjunto de dados utilizado,
embora tenha confirmado a utilização do índice pelo MySQL.

O filtro por período foi implementado para os oito
indicadores do Dashboard. Sua validação completa
depende da conclusão dos testes documentados.
