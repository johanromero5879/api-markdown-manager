import {inject, injectable} from "inversify";

import {TYPES} from "../../../dependency-injection/types";
import {TokenRepository} from "../domain/TokenRepository";

@injectable()
export class AuthToken {
    @inject(TYPES.TokenRepository) private repository: TokenRepository

    async save(userId: string, token: string) {
        await this.repository.add(userId, token)
    }

    async getAll(userId: string) {
        return await this.repository.getAll(userId)
    }

    async exists(userId: string, token: string) {
        return await this.repository.exists(userId, token)
    }

    async removeAll(userId: string) {
        await this.repository.removeAll(userId)
    }

    async remove(userId: string, token: string): Promise<void> {
        await this.repository.remove(userId, token)
    }
}
