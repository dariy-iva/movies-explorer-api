const router = require('express').Router();
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { notFoundPathErrorText } = require('../utils/constantsText');
const NotFoundError = require('../errors/not-found-err');
const { validateCreateUser, validateLoginUser } = require('../middlewares/validation');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLoginUser, login);
router.post('/signout', logout);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(notFoundPathErrorText));
});

module.exports = router;
