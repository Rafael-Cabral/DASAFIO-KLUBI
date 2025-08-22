import DataLoader from 'dataloader';
import { q } from './db';

type Pessoa = { id: number, nome: string, cpf: string, email: string, telefone: string };
type Plano = { id: number, nome: string, valor_credito: number, parcelas: number, taxa_adm_percentual: number };

export function createLoaders() {
    const pessoasById = new DataLoader<number, Pessoa>(async (ids) => {
        const rows = await q<Pessoa>(
            `SELECT id,nome,cpf,email,telefone FROM pessoas WHERE id = ANY($1)`, [ids]
        );
        const map = new Map(rows.map(r => [r.id, r] as const));
        return ids.map(id => map.get(id)!);
    });

    const planosById = new DataLoader<number, Plano>(async (ids) => {
        const rows = await q<Plano>(
            `SELECT id,nome,valor_credito,parcelas,taxa_adm_percentual FROM planos WHERE id = ANY($1)`, [ids]
        );
        const map = new Map(rows.map(r => [r.id, r] as const));
        return ids.map(id => map.get(id)!);
    });

    return { pessoasById, planosById };
}


