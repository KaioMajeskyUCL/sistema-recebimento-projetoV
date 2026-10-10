# Indicadores do Dashboard

## 1. Objetivo

O Dashboard do Sistema de Gestão e Análise de Recebimento de Cargas apresenta indicadores calculados por consultas SQL ao banco de dados MySQL. Seu objetivo é apoiar o acompanhamento operacional, a identificação de gargalos e a tomada de decisões sobre o recebimento de mercadorias.

O sistema oferece uma visão geral dos registros ativos e uma consulta filtrada por período, por meio do endpoint autenticado:

`GET /dashboard/periodo?data_inicio=AAAA-MM-DD&data_fim=AAAA-MM-DD`

O intervalo considera as datas inicial e final, inclusive. As consultas a seguir correspondem à versão **filtrada por período**; na visão geral, o filtro `AND c.data BETWEEN ? AND ?` (ou `AND data BETWEEN ? AND ?`, conforme o alias) não é aplicado.

## 2. Indicadores, perguntas gerenciais e consultas SQL

### Indicador 1 — Total de cargas

**Pergunta gerencial:** Quantas cargas foram registradas no período selecionado?

**Consulta SQL:**

```sql
SELECT COUNT(*) AS total
FROM Carga
WHERE ativo = TRUE
  AND data BETWEEN ? AND ?;
```

**Aplicação:** Permite acompanhar o volume de cargas registradas e comparar a demanda operacional entre períodos, apoiando o planejamento da equipe e das docas.

**Interpretação:** Conta cargas ativas de qualquer status, inclusive as que ainda não foram finalizadas. Portanto, não representa exclusivamente cargas concluídas.

### Indicador 2 — Total de paletes

**Pergunta gerencial:** Quantos paletes estão associados às cargas registradas no período?

**Consulta SQL:**

```sql
SELECT COALESCE(SUM(quantidade_paletes), 0) AS total
FROM Carga
WHERE ativo = TRUE
  AND data BETWEEN ? AND ?;
```

**Aplicação:** Apoia a avaliação do volume de mercadorias e o dimensionamento de mão de obra e equipamentos de movimentação.

**Interpretação:** Soma os paletes informados nas cargas ativas do período, independentemente de seu status.

### Indicador 3 — Tempo médio de espera

**Pergunta gerencial:** Quanto tempo, em média, os caminhões aguardam entre a chegada e a docagem?

**Consulta SQL:**

```sql
SELECT COALESCE(
    ROUND(AVG(
        TIMESTAMPDIFF(MINUTE, hora_chegada, hora_docagem)
    ), 2), 0
) AS tempoMedio
FROM Carga
WHERE ativo = TRUE
  AND data BETWEEN ? AND ?
  AND hora_chegada IS NOT NULL
  AND hora_docagem IS NOT NULL
  AND hora_docagem >= hora_chegada;
```

**Aplicação:** Ajuda a identificar atrasos na liberação das docas, avaliar filas de caminhões e orientar melhorias no agendamento ou na distribuição das docas.

**Interpretação:** O resultado é expresso em minutos e considera somente cargas com horários válidos para o cálculo.

### Indicador 4 — Tempo médio de descarga

**Pergunta gerencial:** Quanto tempo, em média, decorre entre a docagem e a finalização das cargas?

**Consulta SQL:**

```sql
SELECT COALESCE(
    ROUND(AVG(
        TIME_TO_SEC(TIMEDIFF(hora_finalizacao, hora_docagem)) / 60
    ), 2), 0
) AS tempoMedio
FROM Carga
WHERE ativo = TRUE
  AND data BETWEEN ? AND ?
  AND hora_docagem IS NOT NULL
  AND hora_finalizacao IS NOT NULL
  AND hora_finalizacao >= hora_docagem;
```

**Aplicação:** Permite investigar operações demoradas e avaliar possíveis gargalos na descarga, conferência ou finalização.

**Interpretação:** Apesar do nome do indicador, o intervalo entre docagem e finalização pode abranger outras etapas além da descarga física. O resultado é expresso em minutos.

### Indicador 5 — Cargas por tipo

**Pergunta gerencial:** Qual é a distribuição das cargas entre carga seca e câmara fria no período?

**Consulta SQL:**

```sql
SELECT
    tipo_carga AS tipo,
    COUNT(*) AS quantidade
FROM Carga
WHERE ativo = TRUE
  AND data BETWEEN ? AND ?
GROUP BY tipo_carga
ORDER BY quantidade DESC;
```

**Aplicação:** Ajuda a identificar a demanda por tipo de operação e a organizar recursos adequados às cargas secas e refrigeradas.

**Interpretação:** Considera os tipos `CARGA_SECA` e `CAMARA_FRIA` registrados nas cargas ativas. Tipos sem registros no intervalo não aparecem no resultado.

### Indicador 6 — Cargas por fornecedor

**Pergunta gerencial:** Quais fornecedores concentram o maior número de cargas no período?

**Consulta SQL:**

```sql
SELECT
    f.id AS id_fornecedor,
    f.nome AS fornecedor,
    COUNT(*) AS quantidade
FROM Carga c
INNER JOIN Fornecedor f
    ON c.id_fornecedor = f.id
WHERE c.ativo = TRUE
  AND c.data BETWEEN ? AND ?
GROUP BY f.id, f.nome
ORDER BY quantidade DESC;
```

**Aplicação:** Permite identificar fornecedores com maior frequência de entregas e apoiar o planejamento de recebimentos e a comunicação com fornecedores.

**Interpretação:** Conta cargas ativas por fornecedor, e não a quantidade de paletes ou a qualidade das entregas.

### Indicador 7 — Cargas com problemas

**Pergunta gerencial:** Quantas cargas apresentaram pelo menos um problema no período?

**Consulta SQL:**

```sql
SELECT COUNT(DISTINCT c.id) AS total
FROM Carga c
INNER JOIN Problema p
    ON p.id_carga = c.id
WHERE c.ativo = TRUE
  AND c.data BETWEEN ? AND ?;
```

**Aplicação:** Ajuda a acompanhar a incidência de cargas com ocorrências e a priorizar investigações e ações corretivas.

**Interpretação:** `COUNT(DISTINCT c.id)` evita contar a mesma carga várias vezes quando ela possui mais de um problema. O indicador depende da existência de registros na tabela `Problema`, não apenas do status `COM_PROBLEMAS`.

### Indicador 8 — Problemas por tipo

**Pergunta gerencial:** Quais categorias de problema ocorrem com maior frequência nas cargas do período?

**Consulta SQL:**

```sql
SELECT
    tp.id AS id_tipo_problema,
    tp.nome AS tipo,
    COUNT(p.id) AS quantidade
FROM Problema p
INNER JOIN TipoProblema tp
    ON p.id_tipo_problema = tp.id
INNER JOIN Carga c
    ON p.id_carga = c.id
WHERE c.ativo = TRUE
  AND c.data BETWEEN ? AND ?
GROUP BY tp.id, tp.nome
ORDER BY quantidade DESC;
```

**Aplicação:** Permite identificar as ocorrências mais frequentes, como avarias, divergências de quantidade, temperatura ou documentação, e direcionar medidas preventivas.

**Interpretação:** Conta registros de problemas, não cargas distintas. Uma carga com vários problemas pode contribuir com mais de uma ocorrência. Categorias sem ocorrências no período não aparecem no resultado.

## 3. Implementação e integração

### 3.1. Camadas do sistema

O fluxo de consulta dos indicadores é:

1. **Frontend (HTML, CSS e JavaScript):** coleta o intervalo informado e apresenta cartões e gráficos com Chart.js.
2. **Routes:** recebe a requisição e aplica o middleware de autenticação JWT.
3. **Controller:** lê os parâmetros `data_inicio` e `data_fim` e devolve a resposta HTTP.
4. **Service:** valida o formato, a existência e a ordem das datas; solicita os cálculos ao Repository.
5. **Repository:** executa consultas SQL parametrizadas no MySQL.

### 3.2. Filtro por período

O endpoint `/dashboard/periodo` recebe duas datas no formato `AAAA-MM-DD`. A camada de serviço rejeita datas inexistentes e intervalos em que a data inicial seja posterior à final, retornando HTTP 400.

As consultas utilizam parâmetros `?` vinculados pelo driver MySQL, em vez de concatenar as datas diretamente ao SQL. O filtro `ativo = TRUE` impede que cargas excluídas logicamente entrem nos cálculos.

### 3.3. Atualização dos gráficos

O frontend utiliza os mesmos componentes para a visão geral e a filtrada. Antes de recriar os gráficos com novos dados, a instância anterior do Chart.js é destruída para evitar conflitos no elemento `<canvas>`. O botão **Limpar filtro** solicita novamente a visão geral.

## 4. Limitações e cuidados de interpretação

- **Operações que atravessam a meia-noite:** os campos de horário utilizados atualmente são do tipo `TIME`, sem data associada. As consultas de duração exigem que o horário final seja maior ou igual ao inicial, de modo que operações iniciadas em um dia e encerradas no seguinte não são calculadas corretamente.
- **Ausência de horários válidos:** o `COALESCE` devolve `0` quando não há observações para calcular a média. Esse zero significa ausência de dados válidos, e não necessariamente espera ou descarga instantânea.
- **Cargas ativas, não apenas finalizadas:** os totais de cargas e paletes incluem diferentes status. A interpretação deve considerar esse critério.
- **Data usada nos problemas:** os indicadores 7 e 8 filtram pela data da **carga** (`c.data`), e não pela data em que o problema foi registrado (`p.data_registro`).
- **Exclusão lógica:** cargas inativas são desconsideradas. Isso pode fazer os totais históricos diminuírem após uma exclusão lógica.
- **Exclusão física de problemas:** problemas removidos deixam de contribuir para os indicadores de ocorrências.
- **Intervalos sem registros:** contagens e somas retornam zero; consultas agrupadas retornam listas vazias. A interface deve tratar essas situações sem apresentar dados anteriores como se fossem atuais.

## 5. Evidências de testes e validação

Na consulta ao período de **01/10/2026 a 09/10/2026**, a API retornou os seguintes resultados confirmados durante o desenvolvimento:

| Indicador | Resultado observado |
|---|---:|
| Total de cargas | 2 |
| Total de paletes | 32 |

Os valores dos demais indicadores dependem dos registros e horários presentes no banco no momento de cada teste; não foram fixados neste documento.

A validação completa do RF13 deve incluir períodos com e sem registros, datas invertidas, datas inexistentes, acesso sem JWT e restauração dos dados gerais pelo botão **Limpar filtro**. Testes ainda não confirmados não devem ser apresentados como aprovados.

## 6. Conclusão

Os oito indicadores permitem acompanhar volume de cargas, paletes, tempos operacionais, distribuição por tipo e fornecedor e incidência de problemas. O filtro por período amplia a utilidade do Dashboard ao permitir análises de intervalos específicos. As limitações descritas devem ser consideradas na interpretação dos resultados e na evolução futura do sistema.
