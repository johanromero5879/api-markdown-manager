import {injectable} from "inversify";

import RedisRepository from "../../../shared/infrastructure/RedisRepository";
import {TokenRepository} from "../../domain/TokenRepository";

@injectable()
export class RedisTokenRepository extends RedisRepository implements TokenRepository {
    async add(userId: string, token: string) {
        await this.push(`user:${ userId }`, token)
    }

    async getAll(userId: string) {
        return await this.getList(`user:${ userId }`)
    }

    async exists(userId: string, token: string) {
        return await this.existsItem(`user:${ userId }`, token)
    }

    async removeAll(userId: string) {
        await this.removeList(`user:${ userId }`)
    }

    async remove(userId: string, token: string): Promise<void> {
        await this.removeItem(`user:${ userId }`, token)
    }
}
