import express, { json } from 'express'
import { config } from 'dotenv'

/* Settings */
config() // Setup environment variables

const apiRoot = process.env.API_ROOT || '/'
const app = express()

app.set('port', process.env.PORT || 3000)

/* Middlewares */
app.use(json())

/* Endpoints */
app.get(apiRoot, (req, res) => {
    res.send("Markdown manager API")
})

/* Starting server */
app.listen(app.get('port'), () => {
    console.log(`Server is listening to on port ${app.get('port')}`)
})