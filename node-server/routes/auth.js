const auth_controller = require('../controllers/auth_controller');
const express = require('express');
const router = express.Router();

router.post('/login', auth_controller.login);
router.post('/register', auth_controller.register);
router.post('/forget', auth_controller.forget);
router.post('/reset', auth_controller.reset);
module.exports = router;
