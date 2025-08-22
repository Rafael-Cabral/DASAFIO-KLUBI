import Redis from 'ioredis';
export declare const redis: Redis;
export declare function cacheGet<T>(key: string): Promise<T | null>;
export declare function cacheSet(key: string, val: any, ttlSec: number): Promise<void>;
//# sourceMappingURL=cache.d.ts.map