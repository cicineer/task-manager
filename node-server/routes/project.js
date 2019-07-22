const project_controller = require('../controllers/project_controller');
const express = require('express');
const router = express.Router();

router.post('/update-members', project_controller.updateProjectUsers);
router.get('/user/id', project_controller.getProjectsByUserId);
router.get('/id', project_controller.getProjectById);
router.post('/:id', project_controller.updateProject);
router.delete('/:id', project_controller.deleteProject);
router.post('/', project_controller.newProject);
module.exports = router;
