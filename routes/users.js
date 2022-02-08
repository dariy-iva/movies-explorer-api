const router = require('express').Router();
const {
  getCurrentUser,
  updateUserProfile,
} = require('../controllers/users');
const { validateUpdateUserProfile } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateUserProfile, updateUserProfile);

module.exports = router;
