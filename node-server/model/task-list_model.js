const { mongoose, ObjectId, Schema } = require('../config/mongoose_constants');

// TaskList Schema
const TaskListSchema = new Schema({
  name: {type: String, required: true},
  order: {type: Number, required: true},
  tasks: [{type: ObjectId, ref: 'Task', default: [], required: true}],
  project: {type: ObjectId, required: true, ref: 'Project'}
});
TaskListSchema.pre('remove', function () {
  const taskList = this;
  taskList.model('Task').deleteMany(
    {taskList: taskList._id},
    {multi: true},
    next
  )
});
TaskListSchema.pre('remove', function () {
  const taskList = this;
  taskList.model('Project').update(
    {taskLists: taskList._id},
    {$pull: {taskLists: taskList._id}},
    {multi: true},
    next
  )
});
TaskListSchema.post('save', function() {
  const taskList = this;
  taskList.model('Project').update(
    {_id: taskList.project},
    {$push: {taskLists: taskList._id}},
    {multi: true},
    next
  )
});
const TaskList = mongoose.model('TaskList', TaskListSchema);

module.exports = {TaskList};
