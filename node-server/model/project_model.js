const { mongoose, ObjectId, Schema } = require('../config/mongoose_constants');

// Project Schema section
const ProjectSchema = new Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  coverImg: {type: String, required: true},
  users: [{type: ObjectId, ref: 'User', default: []}],
  taskLists: [{type: ObjectId, ref: 'TaskList', default: []}]
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

module.exports = {Project};
