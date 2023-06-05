const Hapi = require('@hapi/hapi')
const routes = require('./routes')
const { dbInit } = require('./db')
const User = require('./models/User')

const init = async (request, h) => {
  try {
    const server = Hapi.server({
      port: 5000,
      host: 'localhost',
      routes: {
        cors: {
          origin: ['*']
        }
      }
    })

    await server.register(require('@hapi/cookie'))

    server.auth.strategy('session', 'cookie', {
      cookie: {
        name: 'mvsapi-cookie',
        password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
        isSecure: false
      },
      redirectTo: '/login',
      validateFunc: async (request, session) => {
        const account = await User.findOne({ _id: session.id })

        if (!account) {
          return { valid: false }
        }

        return { valid: true, credentials: account }
      }
    })

    server.auth.default({
      strategy: 'session',
      mode: 'try'
    })

    server.route(routes)

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })
    response.code(500)
    return response
  }
}

dbInit()

init()
