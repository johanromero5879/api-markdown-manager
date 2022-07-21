import {injectable} from "inversify";
import Schema from "validate";

import Validator from "../../shared/domain/Validator";

@injectable()
export class RoleValidator extends Validator {
    constructor() {
        super()
        this.validator = new Schema({
            name: {
                type: String,
                required: true,
                length: { min: 3, max: 30 }
            },
            max_session_inactivity: {
                type: Number,
                size: { min: 1, max: 90 }
            }
        })
    }
}

@injectable()
export class RoleUpdatedValidator extends RoleValidator {
    constructor() {
        super()
        this.validator.path('name').required(false)
    }

    getMessageError(obj) {
        if(!obj.name && !obj.max_session_inactivity) {
            return 'You must put at least one valid parameter to update.'
        }
        return super.getMessageError(obj)
    }
}
