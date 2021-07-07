const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const HasuraClient = require('./models/HasuraClient')

const hasuraUrl = 'http://host.docker.internal:8080/v1/graphql'
const hasuraHeaders = {
    'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
}

const hasuraClient = new HasuraClient(hasuraUrl, hasuraHeaders)
const port = process.env.PORT

app.use(express.json())

app.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.contrasena, 10)
    const userResponse = await hasuraClient.createUser(
        req.body.email,
        hashedPassword
    )
    if (userResponse.errors)
        return res.status(400).json({ error: userResponse.errors[0].message })
    const user = userResponse.data.insert_usuario_one
    res.status(200).json({ data: user })
})

app.post('/login', (req, res) => {
    res.send('Hello World!!!!')
})

app.listen(port, () => {
    console.log(`Puede ver la aplicación en http://localhost:${port}`)
})
