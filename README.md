## Visão geral

API GraphQL em Node.js (Fastify + Mercurius) com Postgres. Inclui paginação por cursor, cache simples e DataLoader.

## Requisitos

- Node.js LTS (18+)
- Docker e Docker Compose
- psql (opcional, para execução manual de SQL)

## Banco de dados (Docker na 5433)

Suba o Postgres com init automático de schema, índices e seed:

```bash
docker compose up -d
```

Credenciais padrão e URL:

```bash
export DATABASE_URL='postgres://klubi:klubi@localhost:5433/klubi'
```

Verifique:

```bash
psql "$DATABASE_URL" -c '\dt'
psql "$DATABASE_URL" -c 'SELECT * FROM planos LIMIT 5;'
```

Estrutura de init:
- `docker/init/00-apply-sql.sh`: aplica `sql/schema.sql`, `sql/indexes.sql`, `sql/seed.sql`
- `sql/`: arquivos SQL do projeto

## Instalação e execução

```bash
npm install
```

Desenvolvimento (porta 4000):

```bash
npm run dev
```

Produção:

```bash
npm run build
npm start
```

Variáveis suportadas:
- `DATABASE_URL`: conexão do Postgres (ex.: `postgres://klubi:klubi@localhost:5433/klubi`)
- `PORT`: porta do servidor (padrão `4000`)

## Endpoints

- GraphQL: `http://localhost:4000/graphql`
- GraphiQL: `http://localhost:4000/graphiql` (habilitado quando `NODE_ENV` ≠ `production`)

## Testes rápidos no GraphiQL

- Agregados de contratos: `http://localhost:4000/graphiql#query=query%20%7B%20agregadosContratos%20%7B%20status%20total%20%7D%20%7D`

- Listar planos (first=5):
`http://localhost:4000/graphiql#query=query%28%24first%3AInt%29%7B%20planos%28first%3A%24first%29%7B%20edges%7B%20node%7B%20id%20nome%20valor_credito%20parcelas%20taxa_adm_percentual%20%7D%20cursor%20%7D%20endCursor%20hasNextPage%20%7D%20%7D&variables=%7B%22first%22%3A5%7D`

- Criar pessoa:
`http://localhost:4000/graphiql#query=mutation%28%24n%3AString%21%2C%24c%3AString%21%2C%24e%3AString%21%2C%24t%3AString%21%29%7B%20criarPessoa%28nome%3A%24n%2C%20cpf%3A%24c%2C%20email%3A%24e%2C%20telefone%3A%24t%29%7B%20id%20nome%20cpfMasked%20email%20telefone%20%7D%20%7D&variables=%7B%22n%22%3A%22Maria%20Silva%22%2C%22c%22%3A%22123.456.789-09%22%2C%22e%22%3A%22maria%40example.com%22%2C%22t%22%3A%22%2B55%2011%2099999-0000%22%7D`

- Buscar pessoas (q="maria", first=10):
`http://localhost:4000/graphiql#query=query%28%24q%3AString%2C%24first%3AInt%29%7B%20pessoas%28q%3A%24q%2C%20first%3A%24first%29%7B%20edges%7B%20node%7B%20id%20nome%20cpfMasked%20email%20telefone%20%7D%20cursor%20%7D%20endCursor%20hasNextPage%20%7D%20%7D&variables=%7B%22q%22%3A%22maria%22%2C%22first%22%3A10%7D`

- Contratos por pessoa (pessoaId=1):
`http://localhost:4000/graphiql#query=query%28%24id%3AID%21%29%7B%20contratosPorPessoa%28pessoaId%3A%24id%29%7B%20edges%7B%20node%7B%20id%20data_contratacao%20status%20parcelas_pagas%20%7D%20%7D%20%7D%20%7D&variables=%7B%22id%22%3A1%7D`

## Estrutura principal

- `src/server.ts`: servidor Fastify + Mercurius
- `src/schema.ts`: schema GraphQL
- `src/resolvers.ts`: resolvers (queries/mutations)
- `src/db.ts`: pool e execução de queries
- `src/loaders.ts`: DataLoader
- `src/pagination.ts`: encode/decode de cursor e conexão

## Execução manual de SQL (opcional)

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f sql/schema.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f sql/indexes.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f sql/seed.sql
```

## Troubleshooting

- Erro "relation \"pessoas\" does not exist": aplique `sql/schema.sql` (Docker já faz isso no init).
- Erro de `ON CONFLICT` em `cpf`: garanta índices únicos via `sql/indexes.sql`.
- Conexão recusada: verifique `docker compose up -d`, porta `5433` livre e `DATABASE_URL` correto.


