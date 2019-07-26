const Task = require('../model/task_model').Task;

// task schema
// {
//   taskList: {type: Schema.Types.ObjectId, ref: 'TaskList', required: true},
//   name: {type: String, required: true},
//   description: {type: String, required: true},
//   priority: {type: Number, required: true},
//   owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
//   participants: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
//   startDate: {type: Date, required: true},
//   dueDate: {type: Date, required: true},
//   createDate: {type: Date, required: true},
//   completed: {type: Boolean, required: true},
//   remark: {type: String}
// }

exports.newTask = async function (req, res) {
  const reqParams = req.body;
  const newTask = new Task({
    taskList: reqParams.taskListId,
    name: reqParams.task.name,
    description: reqParams.task.desc,
    priority: reqParams.task.priority,
    owner: reqParams.task.ownerId,
    participants: reqParams.task.participantIds,
    startDate: reqParams.task.startDate,
    dueDate: reqParams.task.dueDate,
    createDate: reqParams.task.createDate,
    completed: reqParams.task.completed,
    remark: reqParams.task.remark
  });
  try {
    const task = await newTask.save();
    return res.status(200).json(task);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.updateTask = async (req, res) => {
  const taskId = req.params.taskId;
  const updateTask = req.body.task;
  try {
    const task = await Task
      .findOneAndUpdate(
        {_id: taskId},
        {
          name: updateTask.name,
          description: updateTask.description,
          priority: updateTask.priority,
          startDate: updateTask.startDate,
          dueDate: updateTask.dueDate,
          owner: updateTask.owner,
          participants: updateTask.participants,
          remark: updateTask.remark,
        },
        {new: true})
      .exec();
    return res.status(200).json(task);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.completeTask = async (req, res) => {
  const taskId = req.params.taskId;
  const completed = req.body.completed;
  try {
    const task = await Task
      .findOneAndUpdate(
        {_id: taskId},
        {completed: Boolean(completed)},
        {new: true})
      .exec();
    return res.status(200).json(task);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.loadTasksByTaskListId = async function (req, res) {
  const taskListId = req.params.taskListId;
  try {
    const tasks = await Task.find({taskList: taskListId}).exec();
    return res.status(200).json(tasks);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.loadAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).exec();
    return res.status(200).json(tasks);
  } catch (e) {
    return res.status(401).json(e);
  }
};
