import {TokenMiddleware} from "../modules/auth/infrastructure/middlewares/TokenMiddleware";

export const TYPES = {
    // shared
    BcryptAdapter: Symbol.for('BcryptAdapter'),
    JWTAdapter: Symbol.for('JWTAdapter'),

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
    AuthUser: Symbol.for('AuthUser'),
    AuthRepository: Symbol.for('AuthRepository'),
    CredentialsValidator: Symbol.for('CredentialsValidator'),
    TokenMiddleware: Symbol.for('TokenMiddleware'),
    AdminMiddleware: Symbol.for('AdminMiddleware'),
    TokenRepository: Symbol.for('TokenRepository'),
    AuthToken: Symbol.for('AuthToken'),
    AuthController: Symbol.for('AuthController'),
    RefreshTokenController: Symbol.for('RefreshTokenController'),
    LogoutController: Symbol.for('LogoutController'),

    // documents
    DocumentRepository: Symbol.for('DocumentRepository'),
    DocumentCreator: Symbol.for('DocumentCreator'),
    DocumentController: Symbol.for('DocumentController'),
    DocumentValidator: Symbol.for('DocumentValidator'),
}
