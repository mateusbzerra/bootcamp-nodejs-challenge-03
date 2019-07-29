const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')
const Queue = require('../services/Queue')
const PurchaseMail = require('../jobs/PurchaseMail')

class PurchaseController {
  async store(req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.user.id)
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content,
    }).save()
    return res.send()
  }
}

module.exports = new PurchaseController()
