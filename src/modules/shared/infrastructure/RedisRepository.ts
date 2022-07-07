import { createClient, RedisClientType } from 'redis'
import {injectable} from "inversify";

@injectable()
export default class RedisRepository {
    private readonly client: RedisClientType

    constructor() {
        this.client = createClient({ url: process.env.REDIS_URI })
        this.client.connect()
    }

    protected async push(key: string, element) {
        await this.client.rPush(key, element)
    }

    protected async getList(key: string) {
        return await this.client.lRange(key, 0, -1)
    }

    protected async removeList(key: string) {
        await this.client.del(key)
    }

    protected async removeItem(key: string, element) {
        await this.client.lRem(key, 1, element)
    }

    protected async existsItem(key: string, element) {
        return await this.client.lPos(key, element) !== null
    }
}
