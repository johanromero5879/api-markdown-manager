import Schema from 'validate'
import {injectable} from "inversify";

@injectable()
export default abstract class Validator {
    protected validator: Schema

    validate(obj) {
        return this.validator.validate(obj)
    }

    getMessageError(obj) {
        return this.validate(obj).toString().replace(/,/g, '\r\n')
    }
}
