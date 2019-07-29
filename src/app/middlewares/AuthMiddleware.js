const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = header.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    req.user = decoded
    return next()
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
