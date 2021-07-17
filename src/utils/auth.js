const jwt = require('jsonwebtoken')

const HASURA_JWT_SECRET = process.env.HASURA_GRAPHQL_JWT_SECRET

function generateToken(user) {
    payload = {
        'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': user.id,
        },
    }
    return jwt.sign(payload, HASURA_JWT_SECRET, { expiresIn: '1h' })
}

exports.generateToken = generateToken
