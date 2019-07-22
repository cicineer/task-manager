const user_controller = require('../controllers/user_controller');
const express = require('express');
const router = express.Router();

router.get('/project/id', user_controller.getUsersByProjectId);
router.get('/search', user_controller.searchUsersByEmail());
module.exports = router;
