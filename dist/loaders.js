"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoaders = createLoaders;
const dataloader_1 = __importDefault(require("dataloader"));
const db_1 = require("./db");
function createLoaders() {
    const pessoasById = new dataloader_1.default(async (ids) => {
        const rows = await (0, db_1.q)(`SELECT id,nome,cpf,email,telefone FROM pessoas WHERE id = ANY($1)`, [ids]);
        const map = new Map(rows.map(r => [r.id, r]));
        return ids.map(id => map.get(id));
    });
    const planosById = new dataloader_1.default(async (ids) => {
        const rows = await (0, db_1.q)(`SELECT id,nome,valor_credito,parcelas,taxa_adm_percentual FROM planos WHERE id = ANY($1)`, [ids]);
        const map = new Map(rows.map(r => [r.id, r]));
        return ids.map(id => map.get(id));
    });
    return { pessoasById, planosById };
}
//# sourceMappingURL=loaders.js.map