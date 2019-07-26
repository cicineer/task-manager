const { mongoose, ObjectId, Schema } = require('../config/mongoose_constants');

// Task Schema
const TaskSchema = new Schema({
  taskList: {type: ObjectId, ref: 'TaskList', required: true},
  name: {type: String, required: true},
  description: {type: String, required: true},
  priority: {type: Number, required: true},
  owner: {type: ObjectId, ref: 'User', required: true},
  participants: [{type: ObjectId, ref: 'User', default: []}],
  startDate: {type: Date, required: true},
  dueDate: {type: Date, required: true},
  createDate: {type: Date, required: true},
  completed: {type: Boolean, required: true},
  remark: {type: String}
});

TaskSchema.pre('remove', function () {
  const task = this;
  task.model('TaskList').update(
    {tasks: task._id},
    {$pull: {tasks: task._id}},
    {multi: true},
    next
  )
});

TaskSchema.post('save', function () {
  const task = this;
  task.model('TaskList').update(
    {_id: task.taskList},
    {$push: {tasks: task._id}},
    {multi: true},
    next
  )
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task};
