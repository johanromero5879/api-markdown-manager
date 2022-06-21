import UserType from "../../usertype/domain/UserType"

export default interface User {
    username: string,
    password: string,
    full_name: string,
    last_login?: Date,
    role: UserType
}
