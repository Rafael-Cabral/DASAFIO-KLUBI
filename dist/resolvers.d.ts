export declare const resolvers: {
    Query: {
        pessoa(_: any, { q: search, first, after }: any): Promise<any>;
        pessoaPorCpf(_: any, { cpf }: any): Promise<any>;
        planos(_: any, { first, after, min_valor, max_valor, parcelas }: any): Promise<any>;
        contratosPorPessoa(_: any, { pessoaId, status, first, after }: any): Promise<any>;
        agregadosContratos(): Promise<any>;
    };
    Mutation: {
        criarPessoa(_: any, { nome, cpf, email, telefone }: any): Promise<any>;
        criarContrato(_: any, { pessoaId, planoId }: any): Promise<any>;
        atualizarStatusContrato(_: any, { contratoId, status }: any): Promise<any>;
    };
    Pessoa: {
        cpfMasked: (p: any) => string;
    };
    Contrato: {
        pessoa: (c: any, _: any, { loaders }: any) => any;
        plano: (c: any, _: any, { loaders }: any) => any;
    };
};
//# sourceMappingURL=resolvers.d.ts.map