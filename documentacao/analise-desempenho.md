
# Análise de Desempenho das Consultas SQL

## 1. Objetivo

Avaliar o desempenho das consultas de cargas
utilizando o MySQL e verificar o impacto da
criação de um índice sobre os campos utilizados
nos filtros do sistema.

## 2. Ambiente de testes

O banco de dados foi populado com aproximadamente
5.000 cargas de teste, permitindo avaliar consultas
com um volume maior de registros.

A análise utilizou os comandos EXPLAIN e
EXPLAIN ANALYZE do MySQL.

## 3. Índice implementado

Foi criado o seguinte índice composto:

```sql
CREATE INDEX idx_carga_status_ativo_data
ON Carga(status, ativo, data);
```

O índice foi desenvolvido para apoiar consultas
que utilizam status, situação ativa e data.

## 4. Resultados observados

| Situação | Tempo observado |
|---|---:|
| Antes da criação do índice | 2,89 ms |
| Depois da criação do índice | 3,03 ms |

O comando EXPLAIN confirmou que o MySQL
selecionou o índice idx_carga_status_ativo_data.

A análise também identificou aproximadamente
1.002 linhas examinadas na etapa de acesso
por intervalo do índice.

O plano apresentou as operações:

- Using index condition
- Using temporary
- Using filesort

## 5. Interpretação dos resultados

Embora o índice tenha sido utilizado pelo MySQL,
não foi observado ganho de desempenho nessa
medição específica.

O tempo passou de 2,89 ms para 3,03 ms,
uma diferença de 0,14 ms.

Essa diferença é pequena e não permite concluir
que o índice prejudicou o desempenho.

Os resultados podem variar conforme o volume
de dados, a distribuição dos registros,
o cache e as condições de execução.

## 6. Conclusão

A criação do índice demonstrou a aplicação
de uma técnica de otimização de consultas SQL.

Entretanto, o teste realizado não comprovou
redução do tempo de execução.

Para uma avaliação mais conclusiva, seria
necessário repetir as medições, comparar
diferentes volumes de dados e analisar outros
padrões de consulta.

A escolha de índices deve considerar os
filtros utilizados e os planos de execução
produzidos pelo banco de dados.
