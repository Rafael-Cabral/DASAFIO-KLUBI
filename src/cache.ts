import Redis from 'ioredis';
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function cacheGet<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) as T : null;
}
export async function cacheSet(key: string, val: any, ttlSec: number) {
    await redis.set(key, JSON.stringify(val), 'EX', ttlSec);
}


