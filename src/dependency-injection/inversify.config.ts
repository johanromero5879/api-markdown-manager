import { Container } from 'inversify'
import 'reflect-metadata'

import { TYPES } from "./types";

/* Interfaces */
import {RoleRepository} from "../modules/role/domain/RoleRepository";
import {UserRepository} from "../modules/user/domain/UserRepository";

/* Classes */
import {RoleCreator} from "../modules/role/application/RoleCreator";
import {RolePostController} from "../modules/role/infraestructure/RolePostController";
import Validator from "../modules/shared/domain/Validator";
import {RoleUpdatedValidator, RoleValidator} from "../modules/role/domain/RoleValidator";
import {MongoRoleRepository} from "../modules/role/infraestructure/MongoRoleRepository";
import {RoleGetController} from "../modules/role/infraestructure/RoleGetController";
import {RoleFinder} from "../modules/role/application/RoleFinder";
import {RolePatchController} from "../modules/role/infraestructure/RolePatchController";
import {RoleUpdater} from "../modules/role/application/RoleUpdater";
import {MongoUserRepository} from "../modules/user/infraesctucture/MongoUserRepository";
import {UserCreator} from "../modules/user/application/UserCreator";
import {UserPostController} from "../modules/user/infraesctucture/UserPostController";
import {UserValidator} from "../modules/user/domain/UserValidator";
import {UserFinder} from "../modules/user/application/UserFinder";
import {UserGetController} from "../modules/user/infraesctucture/UserGetController";
import {BcryptAdapter} from "../modules/shared/application/BcryptAdapter";
import {AuthPostController} from "../modules/auth/infraestructure/AuthPostController";


const container = new Container()

// shared
container.bind<BcryptAdapter>(TYPES.BcryptAdapter).to(BcryptAdapter)

// roles
container.bind<RoleRepository>(TYPES.RoleRepository).to(MongoRoleRepository)
container.bind<RoleCreator>(TYPES.RoleCreator).to(RoleCreator)
container.bind<RolePostController>(TYPES.RolePostController).to(RolePostController)
container.bind<Validator>(TYPES.RoleValidator).to(RoleValidator)
container.bind<Validator>(TYPES.RoleUpdatedValidator).to(RoleUpdatedValidator)
container.bind<RoleGetController>(TYPES.RoleGetController).to(RoleGetController)
container.bind<RoleFinder>(TYPES.RoleFinder).to(RoleFinder)
container.bind<RolePatchController>(TYPES.RolePatchController).to(RolePatchController)
container.bind<RoleUpdater>(TYPES.RoleUpdater).to(RoleUpdater)

// users
container.bind<UserRepository>(TYPES.UserRepository).to(MongoUserRepository)
container.bind<UserCreator>(TYPES.UserCreator).to(UserCreator)
container.bind<UserPostController>(TYPES.UserPostController).to(UserPostController)
container.bind<Validator>(TYPES.UserValidator).to(UserValidator)
container.bind<UserFinder>(TYPES.UserFinder).to(UserFinder)
container.bind<UserGetController>(TYPES.UserGetController).to(UserGetController)

// auth
container.bind<AuthPostController>(TYPES.AuthPostController).to(AuthPostController)

export { container }
