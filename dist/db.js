"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.q = q;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, idleTimeoutMillis: 30000, statement_timeout: 5000
});
async function q(text, params = []) {
    const client = await exports.pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows;
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=db.js.map