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

/* Application */
import {RoleCreator} from "../modules/role/application/RoleCreator";
import {RoleFinder} from "../modules/role/application/RoleFinder";
import {RoleUpdater} from "../modules/role/application/RoleUpdater";
import {UserCreator} from "../modules/user/application/UserCreator";
import {UserValidator} from "../modules/user/domain/UserValidator";
import {UserFinder} from "../modules/user/application/UserFinder";
import {BcryptAdapter} from "../modules/shared/application/BcryptAdapter";
import {AuthLogin} from "../modules/auth/application/AuthLogin";

/* Infrastructure */
import {JWTAdapter} from "../modules/shared/infrastructure/JWTAdapter";
import {ValidatorTokenMiddleware} from "../modules/auth/infrastructure/ValidatorTokenMiddleware";
import {MongoUserRepository} from "../modules/user/infrastructure/MongoUserRepository";
import {MongoRoleRepository} from "../modules/role/infrastructure/MongoRoleRepository";
import {MongoAuthRepository} from "../modules/auth/infrastructure/MongoAuthRepository";
import {UsersController} from "../modules/user/infrastructure/UsersController";
import {RolesController} from "../modules/role/infrastructure/RolesController";
import {AuthController} from "../modules/auth/infrastructure/AuthController";
import RedisRepository from "../modules/shared/infrastructure/RedisRepository";

const container = new Container()

// shared
container.bind<BcryptAdapter>(TYPES.BcryptAdapter).to(BcryptAdapter)
container.bind<JWTAdapter>(TYPES.JWTAdapter).to(JWTAdapter)
container.bind<RedisRepository>(TYPES.RedisRepository).to(RedisRepository)

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
container.bind<AuthLogin>(TYPES.AuthLogin).to(AuthLogin)
container.bind<AuthRepository>(TYPES.AuthRepository).to(MongoAuthRepository)
container.bind<Validator>(TYPES.CredentialsValidator).to(CredentialsValidator)
container.bind<ValidatorTokenMiddleware>(TYPES.ValidatorTokenMiddleware).to(ValidatorTokenMiddleware)
container.bind<AuthController>(TYPES.AuthController).to(AuthController)

export { container }
