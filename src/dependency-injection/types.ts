import {UserGetController} from "../modules/user/infraesctucture/UserGetController";

export const TYPES = {
    // roles
    RoleRepository: Symbol.for('RoleRepository'),
    RoleCreator: Symbol.for('RoleCreator'),
    RolePostController: Symbol.for('RolePostController'),
    RoleValidator: Symbol.for('RoleValidator'),
    RoleUpdatedValidator: Symbol.for('RoleUpdatedValidator'),
    RoleGetController: Symbol.for('RoleGetController'),
    RoleFinder: Symbol.for('RoleFinder'),
    RolePatchController: Symbol.for('RolePatchController'),
    RoleUpdater: Symbol.for('RoleUpdater'),

    // users
    UserRepository: Symbol.for('UserRepository'),
    UserCreator: Symbol.for('UserCreator'),
    UserPostController: Symbol.for('UserPostController'),
    UserValidator: Symbol.for('UserValidator'),
    UserFinder: Symbol.for('UserFinder'),
    UserGetController: Symbol.for('UserGetController')
}
