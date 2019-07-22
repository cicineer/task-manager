const task_controller = require('../controllers/task_controller');
const express = require('express');
const router = express.Router();

router.get('/taskLists/:taskListId', task_controller.loadTasksByTaskListId);
router.post('/complete/:taskId', task_controller.completeTask);
// router.post('/move', task_controller.moveTask);
// router.post('/moveAll', task_controller.moveAllTask);
router.post('/:taskId', task_controller.updateTask);
router.get('/', task_controller.loadAllTasks);
router.post('/', task_controller.newTask);
module.exports = router;
