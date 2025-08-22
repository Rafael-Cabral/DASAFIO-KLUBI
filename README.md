## Visão geral

API GraphQL em Node.js (Fastify + Mercurius) com Postgres. Inclui paginação por cursor, cache simples e DataLoader.

## Requisitos

- Node.js LTS (18+)
- Docker e Docker Compose
- psql (opcional, para execução manual de SQL)

## Banco de dados (Docker na 5433) e Redis

Suba o Postgres com init automático de schema, índices e seed:

```bash
docker compose up -d
```

Credenciais padrão e URL:

```bash
export DATABASE_URL='postgres://klubi:klubi@localhost:5433/klubi'
export REDIS_URL='redis://localhost:6379'
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

## Por que estas técnicas e como trazem resiliência

- Rate limit (no `src/server.ts`): limita 100 req/min por IP usando Redis. Evita abuso, protege o banco e o GraphQL contra picos e ataques, mantendo latência estável e prevenindo esgotamento de conexões.
- Cache (em `src/cache.ts` e usado nos resolvers): armazena resultados de consultas quentes (ex.: listas e agregados) por janelas curtas. Reduz carga no Postgres, suaviza spikes e melhora tempo de resposta.
- Paginação por cursor (em `src/pagination.ts`): usa keyset pagination por `id`, estável sob inserções e com custo previsível. Evita `OFFSET` custoso, reduzendo leituras e contendas no banco em listas grandes.

Essas três camadas combinadas adicionam backpressure (rate limit), reduzem trabalho repetido (cache) e tornam navegação de listas eficiente e previsível (paginação), melhorando disponibilidade e experiência mesmo sob alta concorrência.


