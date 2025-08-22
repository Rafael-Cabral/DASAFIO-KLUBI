export type Cursor = string;
export declare const encode: (id: number) => string;
export declare const decode: (c?: Cursor | null) => number | undefined;
export declare function toConnection<T extends {
    id: number;
}>(rows: T[], first: number): {
    edges: {
        node: T;
        cursor: string;
    }[];
    endCursor: string | null;
    hasNextPage: boolean;
};
//# sourceMappingURL=pagination.d.ts.map