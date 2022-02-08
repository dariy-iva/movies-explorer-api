const router = require('express').Router();
const {
  createMovie,
  getUsersMovies,
  deleteMovie,
} = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation');

router.post('/', validateCreateMovie, createMovie);
router.get('/', getUsersMovies);
router.delete('/:id', validateDeleteMovie, deleteMovie);

module.exports = router;
