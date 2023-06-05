const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  },
  genres: {
    type: [String],
    required: true
  },
  casts: {
    type: [String],
    required: true
  },
  releaseYear: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Movie', movieSchema)
