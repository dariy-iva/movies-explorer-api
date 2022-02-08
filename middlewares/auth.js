const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { authBlockText } = require('../utils/constantsText');

const { configServer } = require('../utils/config');

const {
  JWT_SECRET = configServer.JWT_SECRET,
} = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError(authBlockText);
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(authBlockText));
  }

  req.user = payload;
  next();
};
