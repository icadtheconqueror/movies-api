const { getAllUsersHandler, registerUserHandler } = require('./handlers/userHandler')
const { loginUserHandler, logoutUserHandler } = require('./handlers/authHandler')
const { addMovieHandler, getAllMoviesHandler, getAllMoviesByGenreHandler, getMovieByIdHandler, editMovieByIdHandler, deleteMovieByIdHandler } = require('./handlers/movieHandler')

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      const response = h.response({
        status: 'success',
        message: 'Selamat datang di Movies API'
      })
      response.code(200)
      return response
    }
  },
  {
    method: 'GET',
    path: '/users',
    handler: getAllUsersHandler
  },
  {
    method: 'POST',
    path: '/movies',
    handler: addMovieHandler
  },
  {
    method: 'GET',
    path: '/movies',
    handler: getAllMoviesHandler
  },
  {
    method: 'GET',
    path: '/movies/genre/{genre}',
    handler: getAllMoviesByGenreHandler
  },
  {
    method: 'GET',
    path: '/movies/{movieId}',
    handler: getMovieByIdHandler
  },
  {
    method: 'PUT',
    path: '/movies/{movieId}',
    handler: editMovieByIdHandler
  },
  {
    method: 'DELETE',
    path: '/movies/{movieId}',
    handler: deleteMovieByIdHandler
  },
  {
    method: 'POST',
    path: '/register',
    handler: registerUserHandler
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginUserHandler
  },
  {
    method: 'POST',
    path: '/logout',
    handler: logoutUserHandler
  },
  {
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      const response = h.response({
        status: 'fail',
        message: 'Halaman tidak ditemukan'
      })
      response.code(404)
      return response
    }
  }
]

module.exports = routes
