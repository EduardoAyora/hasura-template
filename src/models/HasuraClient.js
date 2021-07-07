const fetch = require('node-fetch')

class HasuraClient {
    constructor(url, headers) {
        this.url = url
        this.headers = headers
    }

    async runQuery(query, variables) {
        const requestData = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify({
                query: query,
                variables: variables,
            }),
            headers: this.headers,
        })
        if (!requestData.ok) {
            return {
                errors: [
                    {
                        message: `Falló con el código ${requestData.status_code}`,
                    },
                ],
            }
        }
        return await requestData.json()
    }

    async createUser(email, contrasena) {
        return await this.runQuery(
            `
            mutation CreateUser($email: String!, $contrasena: String!) {
                insert_usuario_one(object: {email: $email, contrasena: $contrasena}) {
                    id
                    email
                    contrasena
                }
            }
        `,
            { email: email, contrasena: contrasena }
        )
    }
}

module.exports = HasuraClient
