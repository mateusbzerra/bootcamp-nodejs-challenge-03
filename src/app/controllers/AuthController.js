const User = require('../models/User');

class AuthController {
	async authenticate(req, res) {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ error: 'User not found' });
		}

		if (!await user.compareHash(password)) {
			return res.status(400).json({ error: 'Invalid password' });
		}

		return res.json({ token: User.generateToken(user) });
	}
}

module.exports = new AuthController();
