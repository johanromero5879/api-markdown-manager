import User from "./User";

export default interface UserRepository {
    getById(id: string): Promise<User>;
    save(user: User): Promise<User>;
}
