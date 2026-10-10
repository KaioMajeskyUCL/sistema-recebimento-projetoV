
# CRUDs e validações do sistema

## 1. Operações CRUD

O sistema utiliza uma API REST desenvolvida com Node.js
e Express, integrada ao banco de dados MySQL.


| Entidade | Cadastro | Consulta | Atualização | Exclusão | Autenticação |
|---|---|---|---|---|---|
| Carga | POST | GET | PUT e PATCH (status) | DELETE (lógica) | JWT |
| Fornecedor | POST | GET | PUT | DELETE (lógica) | JWT |
| Problema | POST | GET | PUT | DELETE (física) | JWT |


As operações de atualização devem ser descritas conforme
os métodos HTTP efetivamente utilizados nas rotas.

## 2. Exclusão lógica

As entidades Carga e Fornecedor utilizam o campo
`ativo` para controlar a exclusão lógica.

Quando um registro é excluído, seu campo `ativo`
é alterado para FALSE, preservando os dados no banco.

Essa estratégia permite manter a rastreabilidade
das operações e os relacionamentos existentes.

As consultas operacionais devem desconsiderar
os registros inativos.

## 3. Exclusão física

A entidade Problema utiliza exclusão física.

Nesse caso, o registro é removido da tabela Problema,
em vez de ser apenas marcado como inativo.

Essa decisão permite corrigir registros de problemas
cadastrados indevidamente, mas exige cuidado porque
os dados excluídos deixam de estar disponíveis.

## 4. Validações por camada

| Camada | Responsabilidade |
|---|---|
| Frontend | Verificar campos obrigatórios e orientar o usuário |
| Routes | Definir endpoints e aplicar autenticação |
| Controllers | Receber parâmetros e devolver respostas HTTP |
| Services | Aplicar regras de negócio e validar entradas |
| Repositories | Executar consultas SQL parametrizadas |
| Banco de dados | Garantir chaves primárias, estrangeiras e restrições UNIQUE |

## 5. Exemplos de validações

- Impedir o cadastro de números de carga duplicados.
- Rejeitar fornecedores inexistentes.
- Validar os tipos e status permitidos.
- Rejeitar filtros e períodos com parâmetros inválidos.
- Exigir autenticação JWT nas rotas protegidas.
- Impedir consultas com data inicial posterior à final.

## 6. Tabelas auxiliares

TipoProblema funciona como catálogo de categorias
utilizado na classificação das ocorrências.

HistoricoStatus registra alterações de status das cargas
para fins de rastreabilidade.

Essas tabelas não oferecem necessariamente operações
CRUD completas ao usuário. Suas funções são específicas
dentro do sistema.
