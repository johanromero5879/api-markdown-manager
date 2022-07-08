import {UserValidator} from "../../user/domain/UserValidator";

export class CredentialsValidator extends UserValidator {
    constructor() {
        super()
        this.validator.path('fullname').required(false)
    }
}
