const TaskList = require('../model').TaskList;

// TaskList Schema
// {
//   name: {type: String, required: true},
//   order: {type: Number, required: true},
//   tasks: [{type: Schema.Types.ObjectId, ref: 'Task', default: [], required: true}],
//   project: {type: ObjectId, required: true, ref: 'Project'}
// }

exports.newTaskList = async function (req, res) {
  const reqParams = req.body;
  // console.log(reqParams);
  const newTaskList = new TaskList({
    name: reqParams.name,
    order: reqParams.order,
    project: reqParams.projectId
  });
  try {
    const taskList = await newTaskList.save();
    return res.status(200).json(taskList);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.updateTaskList = async (req, res) => {
  const taskListId = req.params.taskListId;
  const newName = req.body.name;
  try {
    const taskList = await TaskList
      .findOneAndUpdate({_id: taskListId}, {name: newName}, {new: true})
      .exec();
    return res.status(200).json(taskList);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.deleteTaskList = async (req, res) => {
  const taskListId = req.params.taskListId;
  try {
    const taskList = TaskList.findOneAndDelete({_id: taskListId}).exec();
    return res.status(200).json(taskList);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.getTaskListsByProjectId = async function (req, res) {
  const projectId = req.params.projectId;
  try {
    const taskLists = TaskList.find({projects: projectId}).exec();
    return res.status(200).json(taskLists);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.loadAllTaskLists = async (req, res) => {
  try {
    const taskLists = TaskList.find({}).exec();
    return res.status(200).json(taskLists);
  } catch (e) {
    return res.status(401).json(e);
  }
};

