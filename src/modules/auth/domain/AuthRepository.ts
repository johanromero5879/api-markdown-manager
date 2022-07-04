import {User} from "../../user/domain/User";

export interface AuthRepository {
    findByUsername(username: string): Promise<User>
}
