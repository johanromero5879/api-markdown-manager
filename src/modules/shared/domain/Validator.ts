import Schema from 'validate'
import {injectable} from "inversify";

@injectable()
export default abstract class Validator {
    protected validator: Schema

    validate(obj) {
        return this.validator.validate(obj)
    }

    getMessageError(obj) {
        const errors = this.validate(obj)
        if(errors) {
            return errors.toString().replace(/,/g, '\r\n')
        }
        return null
    }
}
