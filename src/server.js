require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const database = require('./config/database')
const validate = require('express-validation')
const Youch = require('youch')
const Sentry = require('@sentry/node')
const sentryConfig = require('./config/sentry')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV != 'production'
    this.sentry()
    this.middlewares()
    this.database()
    this.routes()
    this.exception()
  }

  sentry() {
    Sentry.init(sentryConfig)
  }

  database() {
    mongoose.connect(database.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
    })
  }

  middlewares() {
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes() {
    this.express.use(require('./routes'))
  }

  exception() {
    this.express.use(async (err, req, res, next) => {
      //if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
      //}

      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV != 'production') {
        const youch = new Youch(err)
        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal server error' })
    })
  }
}

module.exports = new App().express
