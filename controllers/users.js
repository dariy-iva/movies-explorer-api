const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const {
  validationErrorName,
  castErrorName,
  validationErrorText,
  conflictUserErrorText,
  unauthorizedErrorText,
  notFoundUserErrorText,
  succcessfulLogoutText,
} = require('../utils/constantsText');
const { configServer } = require('../utils/config');

const {
  JWT_SECRET = configServer.JWT_SECRET,
} = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then(() => res.status(200).send({
        email, name,
      }))
      .catch((err) => {
        if (err.name === validationErrorName) {
          next(new ValidationError(validationErrorText));
        } else if (err.code === 11000) {
          next(new ConflictError(conflictUserErrorText));
        } else {
          next(err);
        }
      }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .status(200)
        .send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new UnauthorizedError(unauthorizedErrorText));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt')
    .status(200)
    .send(succcessfulLogoutText);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUserErrorText);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === castErrorName) {
        next(new ValidationError(validationErrorText));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ValidationError(validationErrorText);
  }

  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUserErrorText);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(conflictUserErrorText));
      } else if (err.name === validationErrorName) {
        next(new ValidationError(validationErrorText));
      } else if (err.name === castErrorName) {
        next(new ValidationError(validationErrorText));
      } else {
        next(err);
      }
    });
};
