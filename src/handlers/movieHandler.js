const { nanoid } = require('nanoid')
const Movie = require('../models/Movie')

const addMovieHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda harus login terlebih dahulu'
    })
    response.code(401)
    return response
  }

  try {
    const { title, synopsis, genres, casts, releaseYear, rating } = request.payload

    const movieId = nanoid(6)

    if (!title || !synopsis || !genres || !casts || !releaseYear || !rating) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan movie. Mohon periksa kembali masukan Anda'
      })
      response.code(400)
      return response
    }

    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const movie = new Movie({
      movieId,
      title,
      synopsis,
      genres,
      casts,
      releaseYear,
      rating,
      createdAt,
      updatedAt
    })

    await movie.save()

    const response = h.response({
      status: 'success',
      message: 'Film berhasil ditambahkan',
      data: {
        movieId: movie.movieId,
        movieTitle: title
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

const getAllMoviesHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda harus login terlebih dahulu'
    })
    response.code(401)
    return response
  }

  try {
    const { title, cast, releaseYear } = request.query

    if (title) {
      const transformTitle = title.trim().toLowerCase()

      const response = h.response({
        status: 'success',
        data: {
          movies: await Movie.find({ title: { $regex: transformTitle, $options: 'i' } }).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        }
      })
      response.code(200)
      return response
    }

    if (cast) {
      const trimCast = cast.trim().toLowerCase()

      const response = h.response({
        status: 'success',
        data: {
          movies: await Movie.find({ casts: { $regex: trimCast, $options: 'i' } }).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        }
      })
      response.code(200)
      return response
    }

    if (releaseYear) {
      const trimReleaseYear = releaseYear.trim()

      const response = h.response({
        status: 'success',
        data: {
          movies: await Movie.find({ releaseYear: trimReleaseYear }).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        }
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'success',
      data: {
        movies: await Movie.find().select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
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

const getAllMoviesByGenreHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda harus login terlebih dahulu'
    })
    response.code(401)
    return response
  }

  try {
    const { genre } = request.params

    if (genre) {
      const trimGenre = genre.trim()

      const response = h.response({
        status: 'success',
        data: {
          movies: await Movie.find({ genres: { $regex: trimGenre } }).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        }
      })
      response.code(200)
      return response
    }
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })
    response.code(500)
    return response
  }
}

const getMovieByIdHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda harus login terlebih dahulu'
    })
    response.code(401)
    return response
  }

  try {
    const movie = await Movie.findOne({ movieId: request.params.movieId }).select({ _id: 0, __v: 0 })

    if (movie) {
      const response = h.response({
        status: 'success',
        data: {
          movie
        }
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Film tidak ditemukan'
    })
    response.code(404)
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

const editMovieByIdHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda harus login terlebih dahulu'
    })
    response.code(401)
    return response
  }

  try {
    const { title, synopsis, genres, casts, releaseYear, rating } = request.payload

    const updatedAt = new Date().toISOString()

    const movie = await Movie.findOne({ movieId: request.params.movieId })

    if (movie) {
      if (title) movie.title = title
      if (synopsis) movie.synopsis = synopsis
      if (genres) movie.genres = genres
      if (casts) movie.casts = casts
      if (releaseYear) movie.releaseYear = releaseYear
      if (rating) movie.rating = rating
      if (updatedAt) movie.updatedAt = updatedAt

      await movie.save()

      const response = h.response({
        status: 'success',
        message: 'Film berhasil diperbaharui'
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui film. movieId tidak ditemukan'
    })
    response.code(404)
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

const deleteMovieByIdHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    const response = h.response({
      status: 'fail',
      message: 'Anda harus login terlebih dahulu'
    })
    response.code(401)
    return response
  }

  try {
    const movie = await Movie.findOne({ movieId: request.params.movieId })

    if (movie) {
      movie.deleteOne({ movieId: request.params.movieId })

      const response = h.response({
        status: 'success',
        message: 'Film berhasil dihapus'
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Film gagal dihapus. movieId tidak ditemukan'
    })
    response.code(404)
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

module.exports = { addMovieHandler, getAllMoviesHandler, getAllMoviesByGenreHandler, getMovieByIdHandler, editMovieByIdHandler, deleteMovieByIdHandler }
