"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
exports.toConnection = toConnection;
const encode = (id) => Buffer.from(String(id)).toString('base64');
exports.encode = encode;
const decode = (c) => c ? Number(Buffer.from(String(c), 'base64').toString('utf8')) : undefined;
exports.decode = decode;
function toConnection(rows, first) {
    const edges = rows.map(r => ({ node: r, cursor: (0, exports.encode)(r.id) }));
    const lastEdge = edges[edges.length - 1];
    const endCursor = lastEdge ? lastEdge.cursor : null;
    const hasNextPage = rows.length === first;
    return { edges, endCursor, hasNextPage };
}
//# sourceMappingURL=pagination.js.map