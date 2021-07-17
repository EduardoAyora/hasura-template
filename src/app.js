const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const HasuraClient = require('./models/HasuraClient')
const generateToken = require('./utils/auth').generateToken

const hasuraUrl = 'http://host.docker.internal:8080/v1/graphql'
const hasuraHeaders = {
    'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
}

const hasuraClient = new HasuraClient(hasuraUrl, hasuraHeaders)
const port = process.env.PORT

app.use(express.json())

app.post('/signup', async (req, res, next) => {
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(req.body.input.contrasena, 10)
    } catch (error) {
        return next({ message: error.message })
    }
    const userResponse = await hasuraClient.createUser(
        req.body.input.email,
        hashedPassword
    )
    if (userResponse.errors)
        return res.status(400).json({ message: userResponse.errors[0].message })
    const user = userResponse.data.insert_usuario_one
    res.status(200).json(user)
})

app.post('/login', async (req, res, next) => {
    const userResponse = await hasuraClient.findUserByEmail(
        req.body.input.email
    )
    user = userResponse.data.usuario[0]
    let isValidPassword = false
    try {
        isValidPassword = await bcrypt.compare(
            req.body.input.contrasena,
            user.contrasena
        )
    } catch (err) {
        return res.status(400).json({
            message: 'No se le pudo dar acceso, verifique sus credenciales',
        })
    }

    if (!isValidPassword)
        return res.status(401).json({
            message: 'Credenciales inválidas',
        })

    let token
    try {
        token = generateToken(user)
    } catch {
        return res.status(500).json({
            message: 'Acceso fallido, por favor intente después',
        })
    }
    res.status(200).json({ token })
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(error.status || 500).json({ message: error.message })
})

app.listen(port, () => {
    console.log(`Puede ver la aplicación en http://localhost:${port}`)
})
