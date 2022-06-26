import { compareSync, hashSync } from 'bcrypt'
import {injectable} from "inversify";

@injectable()
export class BcryptAdapter {
    private readonly salt: number = 10

    hash(text: string): string {
        return hashSync(text, this.salt)
    }

    compare(text: string, hash: string): boolean {
        return compareSync(text, hash)
    }
}
