import {injectable} from "inversify";
import Schema from "validate";

import Validator from "../../shared/domain/Validator";
import {BadRequestError} from "../../../errors/BadRequestError";

@injectable()
export class DocumentValidator extends Validator {
    constructor() {
        super()
        this.validator = new Schema({
            title: {
                type: String,
                length: {
                    min: 5,
                    max: 50
                },
                required: true
            },
            content: {
                type: String,
                length: {
                    min: 5,
                    max: 1500
                },
                required: true
            },
            created_by: {
                type: String
            },
            modified_by: {
                type: String
            }
        })
    }
}

@injectable()
export class DocumentUpdatedValidator extends DocumentValidator {
    constructor() {
        super()
        this.validator.path('title').required(false)
        this.validator.path('content').required(false)
    }

    getMessageError(obj) {
        if(!obj.title && !obj.content) {
            return 'You must put at least one valid parameter to update.'
        }
        return super.getMessageError(obj)
    }
}
