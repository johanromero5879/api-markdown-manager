import {MongoClient} from "mongodb"

const mongoClient = new MongoClient(process.env.MONGODB_URI)

export const createRoles = async () => {
    const rolesCollection = mongoClient.db().collection('roles')

    const count = await rolesCollection.estimatedDocumentCount()
    if(count > 0) return

    await rolesCollection.insertMany([
        {
            name: 'Administrator',
            max_session_inactivity: 10
        },
        {
            name: 'User',
            max_session_inactivity: 10
        },
        {
            name: 'Developer',
            max_session_inactivity: 10
        }
    ])
}
