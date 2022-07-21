import { Container } from 'inversify'
import 'reflect-metadata'

import { TYPES } from "./types";

/* Domain */
import Validator from "../modules/shared/domain/Validator";
import {RoleRepository} from "../modules/role/domain/RoleRepository";
import {UserRepository} from "../modules/user/domain/UserRepository";
import {AuthRepository} from "../modules/auth/domain/AuthRepository";
import {CredentialsValidator} from "../modules/auth/domain/CredentialsValidator";
import {RoleUpdatedValidator, RoleValidator} from "../modules/role/domain/RoleValidator";
import {TokenRepository} from "../modules/auth/domain/TokenRepository";
import {DocumentRepository} from "../modules/document/domain/DocumentRepository";
import {DocumentUpdatedValidator, DocumentValidator} from "../modules/document/domain/DocumentValidator";

/* Application */
import {RoleCreator} from "../modules/role/application/RoleCreator";
import {RoleFinder} from "../modules/role/application/RoleFinder";
import {RoleUpdater} from "../modules/role/application/RoleUpdater";
import {UserCreator} from "../modules/user/application/UserCreator";
import {UserValidator} from "../modules/user/domain/UserValidator";
import {UserFinder} from "../modules/user/application/UserFinder";
import {BcryptAdapter} from "../modules/shared/application/BcryptAdapter";
import {AuthUser} from "../modules/auth/application/AuthUser";
import {AuthToken} from "../modules/auth/application/AuthToken";
import {DocumentCreator} from "../modules/document/application/DocumentCreator";
import {DocumentFinder} from "../modules/document/application/DocumentFinder";
import {DocumentUpdater} from "../modules/document/application/DocumentUpdater";

/* Infrastructure */
import {JWTAdapter} from "../modules/shared/infrastructure/JWTAdapter";
import {TokenMiddleware} from "../modules/auth/infrastructure/middlewares/TokenMiddleware";
import {MongoUserRepository} from "../modules/user/infrastructure/MongoUserRepository";
import {MongoRoleRepository} from "../modules/role/infrastructure/MongoRoleRepository";
import {MongoAuthRepository} from "../modules/auth/infrastructure/repositories/MongoAuthRepository";
import {UsersController} from "../modules/user/infrastructure/UsersController";
import {RolesController} from "../modules/role/infrastructure/RolesController";
import {AuthController} from "../modules/auth/infrastructure/controllers/AuthController";
import {RedisTokenRepository} from "../modules/auth/infrastructure/repositories/RedisTokenRepository";
import {RefreshTokenController} from "../modules/auth/infrastructure/controllers/RefreshTokenController";
import {LogoutController} from "../modules/auth/infrastructure/controllers/LogoutController";
import {AdminMiddleware} from "../modules/auth/infrastructure/middlewares/AdminMiddleware";
import {MongoDocumentRepository} from "../modules/document/infrastructure/MongoDocumentRepository";
import {DocumentController} from "../modules/document/infrastructure/DocumentController";

const container = new Container()

// shared
container.bind<BcryptAdapter>(TYPES.BcryptAdapter).to(BcryptAdapter)
container.bind<JWTAdapter>(TYPES.JWTAdapter).to(JWTAdapter)

// roles
container.bind<RoleRepository>(TYPES.RoleRepository).to(MongoRoleRepository)
container.bind<RoleCreator>(TYPES.RoleCreator).to(RoleCreator)
container.bind<Validator>(TYPES.RoleValidator).to(RoleValidator)
container.bind<Validator>(TYPES.RoleUpdatedValidator).to(RoleUpdatedValidator)
container.bind<RoleFinder>(TYPES.RoleFinder).to(RoleFinder)
container.bind<RoleUpdater>(TYPES.RoleUpdater).to(RoleUpdater)
container.bind<RolesController>(TYPES.RolesController).to(RolesController)

// users
container.bind<UserRepository>(TYPES.UserRepository).to(MongoUserRepository)
container.bind<UserCreator>(TYPES.UserCreator).to(UserCreator)
container.bind<Validator>(TYPES.UserValidator).to(UserValidator)
container.bind<UserFinder>(TYPES.UserFinder).to(UserFinder)
container.bind<UsersController>(TYPES.UsersController).to(UsersController)

// auth
container.bind<AuthUser>(TYPES.AuthUser).to(AuthUser)
container.bind<AuthRepository>(TYPES.AuthRepository).to(MongoAuthRepository)
container.bind<Validator>(TYPES.CredentialsValidator).to(CredentialsValidator)
container.bind<TokenMiddleware>(TYPES.TokenMiddleware).to(TokenMiddleware)
container.bind<AdminMiddleware>(TYPES.AdminMiddleware).to(AdminMiddleware)
container.bind<TokenRepository>(TYPES.TokenRepository).to(RedisTokenRepository)
container.bind<AuthToken>(TYPES.AuthToken).to(AuthToken)
container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<RefreshTokenController>(TYPES.RefreshTokenController).to(RefreshTokenController)
container.bind<LogoutController>(TYPES.LogoutController).to(LogoutController)

// document
container.bind<DocumentRepository>(TYPES.DocumentRepository).to(MongoDocumentRepository)
container.bind<DocumentCreator>(TYPES.DocumentCreator).to(DocumentCreator)
container.bind<DocumentController>(TYPES.DocumentController).to(DocumentController)
container.bind<Validator>(TYPES.DocumentValidator).to(DocumentValidator)
container.bind<DocumentFinder>(TYPES.DocumentFinder).to(DocumentFinder)
container.bind<DocumentUpdater>(TYPES.DocumentUpdater).to(DocumentUpdater)
container.bind<Validator>(TYPES.DocumentUpdatedValidator).to(DocumentUpdatedValidator)

export { container }
