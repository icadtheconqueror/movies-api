const User = require('../models/User')

const getAllUsersHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda harus login terlebih dahulu'
    })
    response.code(401)
    return response
  }

  try {
    const users = await User.find().select({ _id: 0, password: 0, __v: 0, createdAt: 0, updatedAt: 0 })

    const response = h.response({
      status: 'success',
      data: {
        users
      }
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

const registerUserHandler = async (request, h) => {
  try {
    const { username, password, name } = request.payload

    if (!username || !password || !name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan user. Mohon periksa kembali masukan Anda'
      })
      response.code(400)
      return response
    }

    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const findUsername = await User.findOne({ username: request.payload.username })

    if (findUsername) {
      if (findUsername.username === username) {
        const response = h.response({
          status: 'fail',
          message: 'Username tidak tersedia'
        })
        response.code(409)
        return response
      }
    }

    const user = new User({
      username,
      password,
      name,
      createdAt,
      updatedAt
    })

    await user.save()

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId: user._id
      }
    })
    response.code(201)
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

module.exports = { getAllUsersHandler, registerUserHandler }
