const router = require('express').Router();
const { Auth } = require('../middlewares');

router.post('/register', Auth.register);
router.get('/me', Auth.me);

module.exports = router;
