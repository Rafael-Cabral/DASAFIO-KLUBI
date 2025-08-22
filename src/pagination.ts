export type Cursor = string;

export const encode = (id: number) => Buffer.from(String(id)).toString('base64');
export const decode = (c?: Cursor | null) => c ? Number(Buffer.from(String(c), 'base64').toString('utf8')) : undefined;

export function toConnection<T extends { id: number }>(rows: T[], first: number) {
    const edges = rows.map(r => ({ node: r, cursor: encode(r.id) }));
    const lastEdge = edges[edges.length - 1];
    const endCursor = lastEdge ? lastEdge.cursor : null;
    const hasNextPage = rows.length === first;
    return { edges, endCursor, hasNextPage };
}


