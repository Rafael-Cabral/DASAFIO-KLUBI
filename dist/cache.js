"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.cacheGet = cacheGet;
exports.cacheSet = cacheSet;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
async function cacheGet(key) {
    const raw = await exports.redis.get(key);
    return raw ? JSON.parse(raw) : null;
}
async function cacheSet(key, val, ttlSec) {
    await exports.redis.set(key, JSON.stringify(val), 'EX', ttlSec);
}
//# sourceMappingURL=cache.js.map