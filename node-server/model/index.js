const mongoose = require('mongoose'),
  // get the built-in object id
  ObjectId = mongoose.Types.ObjectId,
  // get the Schema of mongoose for creating newones
  Schema = mongoose.Schema;

// User Schema section
const UserSchema = new Schema({
  name: {type: String, required: true, unique: true},
  avatar: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  dateOfBirth: {type: Date, required: true},
  password: {type: String, select: false, required: true},
  // create relationships between Project Model and User Model for population
  projects: [{type: ObjectId, ref: 'Project', default: []}]
});

// define hook when a user gets removed, the project user lists will remove
UserSchema.pre('remove', function () {
  const user = this;
  user.model('Project').update(
    {users: user._id},
    {$pull: {users: user._id}},
    {multi: true},
    next
  );
});
// get the model of User Schema for creating new model (entity)
const User = mongoose.model('User', UserSchema);


// Project Schema section
const ProjectSchema = new Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  coverImg: {type: String, required: true},
  users: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
  taskLists: [{type: Schema.Types.ObjectId, ref: 'TaskList', default: []}]
});

// define hook when a project gets removed, this project in users' project lists will remove
ProjectSchema.pre('remove', function () {
  const project = this;
  project.model('User').update(
    {projects: project._id},
    {$pull: {projects: project._id}},
    {multi: true},
    next
  )
});

// define hook when a project gets removed, this tasklist belongs to the project will be removed
ProjectSchema.pre('remove', function () {
  const project = this;
  project.model('TaskList').deleteMany(
    {project: project._id},
    {multi: true},
    next
  )
});

ProjectSchema.post('save', function () {
  const project = this;
  Project.model('User').findOneAndUpdate(
    {_id: project.users[0]},
    {$push: {projects: project._id}},
    {multi: true},
    next
  )
});

const Project = mongoose.model('Project', ProjectSchema);

// TaskList Schema
const TaskListSchema = new Schema({
  name: {type: String, required: true},
  order: {type: Number, required: true},
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task', default: [], required: true}],
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

// Task Schema
const TaskSchema = new Schema({
  taskList: {type: Schema.Types.ObjectId, ref: 'TaskList', required: true},
  name: {type: String, required: true},
  description: {type: String, required: true},
  priority: {type: Number, required: true},
  owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  participants: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
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
// exports all the model out for creating new entity
module.exports = {
  User: User,
  Project: Project,
  TaskList: TaskList,
  Task: Task
};

