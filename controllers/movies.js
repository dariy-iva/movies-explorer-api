const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  validationErrorName,
  castErrorName,
  validationErrorText,
  notFoundMovieErrorText,
  forbiddenMovieErrorText,
} = require('../utils/constantsText');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const userId = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === validationErrorName) {
        next(new ValidationError(validationErrorText));
      }
      next(err);
    });
};

module.exports.getUsersMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({ owner: userId })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundMovieErrorText);
      }
      if (!movie.owner.equals(userId)) {
        throw new ForbiddenError(forbiddenMovieErrorText);
      }
      return movie.remove().then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === castErrorName) {
        next(new ValidationError(validationErrorText));
      }
      next(err);
    });
};
