"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `
  scalar Cursor

  type Pessoa {
    id: ID!
    nome: String!
    cpfMasked: String!
    email: String!
    telefone: String!
  }

  type Plano {
    id: ID!
    nome: String!
    valor_credito: Int!
    parcelas: Int!
    taxa_adm_percentual: Int!
  }

  type Contrato {
    id: ID!
    pessoa: Pessoa!
    plano: Plano!
    data_contratacao: String!
    status: String!
    parcelas_pagas: Int!
  }

  type EdgePessoa { node: Pessoa!, cursor: Cursor! }
  type ConnPessoa { edges: [EdgePessoa!]!, endCursor: Cursor, hasNextPage: Boolean! }

  type EdgeContrato { node: Contrato!, cursor: Cursor! }
  type ConnContrato { edges: [EdgeContrato!]!, endCursor: Cursor, hasNextPage: Boolean! }

  type EdgePlano { node: Plano!, cursor: Cursor! }
  type ConnPlano { edges: [EdgePlano!]!, endCursor: Cursor, hasNextPage: Boolean! }

  type ContratosPorStatus { status: String!, total: Int! }

  type Query {
    pessoas(q: String, first: Int = 20, after: Cursor): ConnPessoa!
    pessoaPorCpf(cpf: String!): Pessoa
    planos(first: Int = 20, after: Cursor, min_valor: Int, max_valor: Int, parcelas: Int): ConnPlano!
    contratosPorPessoa(pessoaId: ID!, status: String, first: Int = 20, after: Cursor): ConnContrato!
    agregadosContratos: [ContratosPorStatus!]!
  }

  type Mutation {
    criarPessoa(nome: String!, cpf: String!, email: String!, telefone: String!): Pessoa!
    criarContrato(pessoaId: ID!, planoId: ID!): Contrato!
    atualizarStatusContrato(contratoId: ID!, status: String!): Contrato!
  }
`;
//# sourceMappingURL=schema.js.map