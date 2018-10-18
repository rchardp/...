const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, ResponseMaker } = require('../models');

class Auth {
  constructor() {
    this.register = this.register.bind(this);
    this.me = this.me.bind(this);
  }

  static async register(req, res, next) {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, 8);
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const token = jwt.sign({ id: 1 }, process.env.SECRET, {
        expiresIn: 86400,
      });
      return res.send(ResponseMaker.created('user', {
        user,
        token,
      }));
    } catch (err) {
      return next(err);
    }
  }

  static async me(req, res, next) {
    const token = req.headers['x-access-token'];
    try {
      if (!token) {
        return res.status(401).send({ auth: false, msg: 'No token provided' });
      }

      const decoded = await jwt.verify(token, process.env.SECRET);
      const user = await User.get(decoded.id);
      return res.status(200).send(user);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = Auth;
