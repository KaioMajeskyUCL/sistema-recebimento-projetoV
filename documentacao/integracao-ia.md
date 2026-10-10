
# Integração do Assistente de Inteligência Artificial

## 1. Objetivo

O Assistente de IA permite que usuários consultem
informações operacionais do recebimento de cargas
por meio de perguntas em linguagem natural.

A funcionalidade atende ao requisito RF14.

## 2. Tecnologia utilizada

A integração utiliza a API Google Gemini,
acessada pelo backend Node.js por meio do
pacote @google/genai.

A chave de acesso é armazenada na variável
de ambiente GEMINI_API_KEY, no arquivo .env.

A chave não deve ser enviada ao frontend nem
incluída no repositório público do GitHub.

## 3. Fluxo de funcionamento

1. O usuário digita uma pergunta no frontend.
2. O frontend envia uma requisição POST para
   /assistente/perguntar.
3. O middleware verifica o token JWT.
4. O sistema verifica o limite de requisições.
5. O Service consulta os indicadores do Dashboard.
6. Os indicadores e a pergunta são enviados ao Gemini.
7. A resposta gerada é devolvida ao frontend.
8. O chat apresenta a resposta ao usuário.

## 4. Dados utilizados

O Assistente recebe os seguintes indicadores:

- Total de cargas.
- Total de paletes.
- Tempo médio de espera.
- Tempo médio de descarga.
- Cargas por tipo.
- Cargas por fornecedor.
- Cargas com problemas.
- Problemas por tipo.

Os indicadores são obtidos por consultas SQL
executadas no banco de dados MySQL.

O Assistente não recebe acesso direto ao banco
para executar consultas SQL livremente.

## 5. Tratamento de erros

| Situação | Tratamento |
|---|---|
| Pergunta vazia | Requisição rejeitada |
| Pergunta com mais de 500 caracteres | Requisição rejeitada |
| Token JWT ausente ou inválido | Acesso negado |
| Chave da API não configurada | HTTP 503 |
| Falha na comunicação com Gemini | HTTP 503 |
| Excesso de requisições | Bloqueio temporário |
| Demora excessiva na resposta | Timeout de 30 segundos no frontend |

## 6. Controle de consumo

O sistema utiliza express-rate-limit para
limitar o envio de perguntas ao Assistente.

O limite configurado é de cinco requisições
por minuto, considerando o usuário autenticado.

Além disso, o backend limita o tamanho das
perguntas e a quantidade máxima de tokens
da resposta gerada.

Essas medidas ajudam a controlar o consumo
da API, mas não garantem custo financeiro zero.

## 7. Limitações

O Assistente utiliza os indicadores gerais
fornecidos pelo Dashboard.

Atualmente, as perguntas não são filtradas
automaticamente pelo período selecionado
na interface.

As respostas são geradas por um modelo de IA
e podem conter erros de interpretação.

Por isso, os indicadores SQL continuam sendo
a referência para os valores apresentados.

## 8. Testes realizados

A integração foi testada com perguntas sobre
quantidades e tipos de cargas.

Também foi testado o bloqueio de requisições
após ultrapassar o limite configurado.

Durante o desenvolvimento, uma tentativa de
integração com a API da OpenAI apresentou
indisponibilidade de créditos.

A implementação foi posteriormente realizada
com a API Gemini.
