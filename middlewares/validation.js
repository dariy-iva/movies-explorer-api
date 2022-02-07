const { celebrate, Joi } = require('celebrate');
const { isURL, isEmail } = require('validator');
const { validationURLErrorText, validationEmailErrorText } = require('../utils/constantsText');

const checkURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new Error(validationURLErrorText);
  }
  return value;
};
const checkEmail = (value) => {
  if (!isEmail(value)) {
    throw new Error(validationEmailErrorText);
  }
  return value;
};

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(checkEmail),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(checkEmail),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(checkEmail),
  }),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(checkURL),
    trailer: Joi.string().required().custom(checkURL),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(checkURL),
    movieId: Joi.number().required(),
  }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
});
