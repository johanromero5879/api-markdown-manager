import {injectable} from "inversify";
import Schema from "validate";

import Validator from "../../shared/domain/Validator";

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
