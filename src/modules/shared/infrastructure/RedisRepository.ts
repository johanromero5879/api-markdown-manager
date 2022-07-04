import { createClient, RedisClientType } from 'redis'
import {injectable} from "inversify";

@injectable()
export default class RedisRepository {
    private client: RedisClientType

    constructor() {
        this.client = createClient()
    }

    private async connect() {
        await this.client.connect()
    }

    private disconnect() {
        this.client?.disconnect()
    }

    async set(key: string, value: string) {
        try {
            await this.connect()
            await this.client.set(key, value)
        }finally {
            this.disconnect()
        }
    }

    async get(key: string) {
        try {
            return await this.client.get(key)
        }finally {
            this.disconnect()
        }
    }
}
