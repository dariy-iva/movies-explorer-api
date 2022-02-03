const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const {
  createMovie,
  getUsersMovies,
  deleteMovie,
} = require('../controllers/movies');
const { validationURLErrorText } = require('../utils/constantsText');

const checkURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new Error(validationURLErrorText);
  }
  return value;
};

router.post(
  '/',
  celebrate({
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
      movieId: Joi.string().required().length(24).hex(),
    }),
  }),
  createMovie,
);

router.get('/', getUsersMovies);

router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
