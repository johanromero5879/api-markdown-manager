import {injectable} from "inversify";
import Schema from 'validate'
import Validator from "../../shared/domain/Validator";

const isUsernameValid = (username: string) => /^(?=[\w.]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username)

const isFullNameValid = (fullname: string) => /^(?=[a-zA-ZÀ-ÿ\u00f1\u00d1 ]{6,40}$)(?!.*[ ]{2}).*$/.test(fullname)

const isPasswordValid = (password: string) => /^(?=[\S]{8,20}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_.@$!%*?&]).*$/.test(password)

@injectable()
export class UserValidator extends Validator {
    constructor() {
        super()
        this.validator = new Schema({
            username: {
                type: String,
                required: true,
                use: { isUsernameValid }
            },
            fullname: {
                type: String,
                required: true,
                use: { isFullNameValid }
            },
            password: {
                type: String,
                required: true,
                use: { isPasswordValid }
            }
        })

        this.validator.message({
            isUsernameValid: path =>
                `${path} must be between 8 and 20 alphanumeric characters with special characters: ._
                Not use special characters at the beginning nor end of username.
                Not use special characters twice or more in a row.`,
            isFullNameValid: path =>
                `${path} must be between 6 and 40 alphabetic characters without spaces twice or more in a row.`,
            isPasswordValid: path =>
                `${path} must be between 8 and 20 characters without spaces and at least one uppercase, one lowercase and one special character _.@$!%*?&`
        })
    }
}
