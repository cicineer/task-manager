const task_list_controller = require('../controllers/task-list_controller');
const router = require('express').Router();

// router.post('/swap', task_list_controller.swapTaskListOrder);
router.get('/:projectId', task_list_controller.getTaskListsByProjectId);
router.post('/:taskListId', task_list_controller.updateTaskList);
router.delete('/:taskListId/projectId/:projectId', task_list_controller.deleteTaskList);
router.get('/', task_list_controller.loadAllTaskLists);
router.post('/', task_list_controller.newTaskList);

module.exports = router;
