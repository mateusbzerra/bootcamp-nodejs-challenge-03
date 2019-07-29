const express = require('express')
const routes = express.Router()
const AuthMiddleware = require('./app/middlewares/AuthMiddleware')
const controllers = require('./app/controllers')
const validators = require('./app/validators')
const validate = require('express-validation')

routes.get('/', (req, res) => {
  return res.json({ msg: 'API' })
})
routes.post(
  '/users',
  validate(validators.User),
  controllers.UserController.store
)
routes.post(
  '/login',
  validate(validators.Auth),
  controllers.AuthController.authenticate
)

routes.use(AuthMiddleware)

//Ads
routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post('/ads', validate(validators.Ad), controllers.AdController.store)
routes.put('/ads/:id', validate(validators.Ad), controllers.AdController.update)
routes.delete('/ads/:id', controllers.AdController.destroy)

//Purchase
routes.post(
  '/purchase',
  validate(validators.Purchase),
  controllers.PurchaseController.store
)

module.exports = routes
