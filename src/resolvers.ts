import { q } from './db';
import { encode, decode, toConnection } from './pagination';
import { cacheGet, cacheSet } from './cache';

const PAGE_MAX = 100;

const maskCpf = (cpf: string) => cpf.replace(/\d/g, (d, i) => (i < 9 ? '*' : d));

export const resolvers = {
    Query: {
        async pessoas(_: any, { q: search, first = 20, after }: any) {
            if (first > PAGE_MAX) throw new Error(`first máximo: ${PAGE_MAX}`);
            const key = `pessoas:q=${search || ''}:first=${first}:after=${after || ''}`;
            const hit = await cacheGet<any>(key); if (hit) return hit;

            const afterId = decode(after) ?? 0;
            const rows = await q<any>(`
        SELECT id,nome,cpf,email,telefone
        FROM pessoas
        WHERE ($1::text IS NULL OR nome ILIKE '%'||$1||'%' OR email ILIKE '%'||$1||'%'
               OR REPLACE(REPLACE(REPLACE(cpf,'.',''),'-',''),' ','') LIKE '%'||REPLACE(REPLACE(REPLACE($1,'.',''),'-',''),' ','')||'%')
          AND id > $2
        ORDER BY id ASC
        LIMIT $3
      `, [search ?? null, afterId, first]);

            const conn = toConnection(rows, first);
            await cacheSet(key, conn, 60);
            return conn;
        },

        async pessoaPorCpf(_: any, { cpf }: any) {
            const norm = String(cpf).replace(/\D/g, '');
            const rows = await q<any>(`
        SELECT id,nome,cpf,email,telefone
        FROM pessoas
        WHERE REPLACE(REPLACE(REPLACE(cpf,'.',''),'-',''),' ','') = $1
        LIMIT 1
      `, [norm]);
            return rows[0] || null;
        },

        async planos(_: any, { first = 20, after, min_valor, max_valor, parcelas }: any) {
            if (first > PAGE_MAX) throw new Error(`first máximo: ${PAGE_MAX}`);
            const key = `planos:first=${first}:after=${after || ''}:min=${min_valor || ''}:max=${max_valor || ''}:parc=${parcelas || ''}`;
            const hit = await cacheGet<any>(key); if (hit) return hit;

            const afterId = decode(after) ?? 0;
            const rows = await q<any>(`
        SELECT id,nome,valor_credito,parcelas,taxa_adm_percentual
        FROM planos
        WHERE ($1::bigint IS NULL OR valor_credito >= $1)
          AND ($2::bigint IS NULL OR valor_credito <= $2)
          AND ($3::int    IS NULL OR parcelas = $3)
          AND id > $4
        ORDER BY id ASC
        LIMIT $5
      `, [min_valor ?? null, max_valor ?? null, parcelas ?? null, afterId, first]);

            const conn = toConnection(rows, first);
            await cacheSet(key, conn, 3600);
            return conn;
        },

        async contratosPorPessoa(_: any, { pessoaId, status, first = 20, after }: any) {
            if (first > PAGE_MAX) throw new Error(`first máximo: ${PAGE_MAX}`);
            const key = `contratos:pessoa=${pessoaId}:status=${status || ''}:first=${first}:after=${after || ''}`;
            const hit = await cacheGet<any>(key); if (hit) return hit;

            const afterId = decode(after) ?? 0;
            const rows = await q<any>(`
        SELECT id, pessoa_id, plano_id, data_contratacao, status, parcelas_pagas
        FROM planos_contratados
        WHERE pessoa_id = $1
          AND ($2::text IS NULL OR status = $2)
          AND id > $3
        ORDER BY id ASC
        LIMIT $4
      `, [Number(pessoaId), status ?? null, afterId, first]);

            const conn = {
                edges: rows.map((r: any) => ({ node: r, cursor: encode(r.id) })),
                endCursor: rows.length ? encode(rows[rows.length - 1].id) : null,
                hasNextPage: rows.length === first
            };
            await cacheSet(key, conn, 60);
            return conn;
        },

        async agregadosContratos() {
            const key = `agregados:contratos_por_status`;
            const hit = await cacheGet<any>(key); if (hit) return hit;
            const rows = await q<any>(`
        SELECT status, COUNT(*)::int AS total
        FROM planos_contratados
        GROUP BY status
      `);
            await cacheSet(key, rows, 300);
            return rows;
        },
    },

    Mutation: {
        async criarPessoa(_: any, { nome, cpf, email, telefone }: any) {
            const r = await q<any>(`
        INSERT INTO pessoas (nome, cpf, email, telefone)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (cpf) DO NOTHING
        RETURNING id,nome,cpf,email,telefone
      `, [nome, cpf, email, telefone]);
            if (!r[0]) throw new Error('CPF já existe');
            return r[0];
        },

        async criarContrato(_: any, { pessoaId, planoId }: any) {
            const r = await q<any>(`
        INSERT INTO planos_contratados (pessoa_id, plano_id, data_contratacao, status, parcelas_pagas)
        VALUES ($1,$2, NOW()::date, 'ativo', 0)
        RETURNING id, pessoa_id, plano_id, data_contratacao, status, parcelas_pagas
      `, [Number(pessoaId), Number(planoId)]);
            return r[0];
        },

        async atualizarStatusContrato(_: any, { contratoId, status }: any) {
            const r = await q<any>(`
        UPDATE planos_contratados
        SET status = $2
        WHERE id = $1
        RETURNING id, pessoa_id, plano_id, data_contratacao, status, parcelas_pagas
      `, [Number(contratoId), status]);
            if (!r[0]) throw new Error('Contrato não encontrado');
            return r[0];
        },
    },

    Pessoa: {
        cpfMasked: (p: any) => maskCpf(p.cpf),
    },

    Contrato: {
        pessoa: (c: any, _: any, { loaders }: any) => loaders.pessoasById.load(c.pessoa_id),
        plano: (c: any, _: any, { loaders }: any) => loaders.planosById.load(c.plano_id),
    },
};


