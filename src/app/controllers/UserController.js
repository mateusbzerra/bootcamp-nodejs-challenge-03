const User = require('../models/User');

class UserController {
	async index(req, res) {
		await User.find({}, (err, users) => {
			return res.json(users);
		});
	}
	async store(req, res) {
		const { email } = req.body;

		if (await User.findOne({ email })) {
			return res.status(400).json({ message: 'User already exists' });
		}
		const user = await User.create(req.body);

		return res.json(user);
	}
}

module.exports = new UserController();
