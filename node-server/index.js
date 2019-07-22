const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true},
    avatar: {type: String, required: true},
    email: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    password: {type: String, select: false, required: true},
    projects: [{type: ObjectId, ref: 'Project', default: []}]
});

// define hook when a user gets removed, the project user lists will rem
UserSchema.pre('remove', function() {
    const user = this;
    user.model('Project').update(
        {users: user._id},
        {$pull: {users: user._id}},
        {multi: true},
        next
    );
});

const User = mongoose.model('User', UserSchema);

const ProjectSchema = new Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    coverImg: {type: String, required: true},
    users: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    taskLists: [{type: Schema.Types.ObjectId, ref: 'TaskList', default: []}]
});

ProjectSchema.pre('remove', function() {
    const project = this;
    project.model('User').update(
        {projects: project._id},
        {$pull: {projects: project._id}},
        {multi: true},
        next
    )
});

ProjectSchema.pre('remove', function() {
    const project = this;
    project.model('TaskList').update(
        {projects: project._id},
        {$pull: {projects: project._id}},
        {multi: true},
        next
    )
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = {
    User: User,
    Project: Project
};

