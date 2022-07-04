import {ValidatorTokenMiddleware} from "../modules/auth/infrastructure/ValidatorTokenMiddleware";

export const TYPES = {
    // shared
    BcryptAdapter: Symbol.for('BcryptAdapter'),
    JWTAdapter: Symbol.for('JWTAdapter'),
    RedisRepository: Symbol.for('RedisRepository'),

    // roles
    RoleRepository: Symbol.for('RoleRepository'),
    RoleCreator: Symbol.for('RoleCreator'),
    RoleValidator: Symbol.for('RoleValidator'),
    RoleUpdatedValidator: Symbol.for('RoleUpdatedValidator'),
    RoleFinder: Symbol.for('RoleFinder'),
    RoleUpdater: Symbol.for('RoleUpdater'),
    RolesController: Symbol.for('RolesController'),

    // users
    UserRepository: Symbol.for('UserRepository'),
    UserCreator: Symbol.for('UserCreator'),
    UserValidator: Symbol.for('UserValidator'),
    UserFinder: Symbol.for('UserFinder'),
    UsersController: Symbol.for('UsersController'),

    // auth
    AuthLogin: Symbol.for('AuthLogin'),
    AuthRepository: Symbol.for('AuthRepository'),
    CredentialsValidator: Symbol.for('CredentialsValidator'),
    ValidatorTokenMiddleware: Symbol.for('ValidatorTokenMiddleware'),
    AuthController: Symbol.for('AuthController')
}
