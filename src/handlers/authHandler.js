const User = require('../models/User')

const loginUserHandler = async (request, h) => {
  if (request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda sudah login. Silakan logout terlebih dahulu untuk mengganti User'
    })
    response.code(401)
    return response
  }

  try {
    const { password } = request.payload

    const account = await User.findOne({ username: request.payload.username })

    if (!account || account.password !== password) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal login. Mohon periksa kombinasi username dan password Anda'
      })
      response.code(500)
      return response
    }

    request.cookieAuth.set({ id: account._id })

    const response = h.response({
      status: 'success',
      message: 'User berhasil login'
    })
    response.code(200)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })
    response.code(500)
    return response
  }
}

const logoutUserHandler = (request, h) => {
  if (!request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda harus login terlebih dahulu'
    })
    response.code(401)
    return response
  }

  try {
    const { q } = request.payload

    if (q !== 'true') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal logout'
      })
      response.code(500)
      return response
    }

    request.cookieAuth.clear()

    const response = h.response({
      status: 'success',
      message: 'User berhasil logout'
    })
    response.code(200)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })
    response.code(500)
    return response
  }
}

module.exports = { loginUserHandler, logoutUserHandler }
