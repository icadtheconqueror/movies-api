require('dotenv').config()
const mongoose = require('mongoose')

const dbInit = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true
    })

    console.log('Connected to the database')
  } catch (error) {
    console.log('Database connection error')
  }
}

module.exports = { dbInit }
