import DataLoader from 'dataloader';
type Pessoa = {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
};
type Plano = {
    id: number;
    nome: string;
    valor_credito: number;
    parcelas: number;
    taxa_adm_percentual: number;
};
export declare function createLoaders(): {
    pessoasById: DataLoader<number, Pessoa, number>;
    planosById: DataLoader<number, Plano, number>;
};
export {};
//# sourceMappingURL=loaders.d.ts.map