const Project = require('../model').Project;

// Project Schema
// {
//   name: {type: String, required: true},
//   desc: {type: String, required: true},
//   coverImg: {type: String, required: true},
//   users: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
//   taskLists: [{type: Schema.Types.ObjectId, ref: 'TaskList', default: []}]
// }

exports.newProject = async function (req, res) {
  const reqParams = req.body;
  const newProject = new Project({
    name: reqParams.name,
    desc: reqParams.desc,
    coverImg: reqParams.coverImg,
    users: reqParams.members
  });
  try {
    const project = await newProject.save();
    return res.status(200).json(project);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.updateProject = async function (req, res) {
  const projectId = req.params.id;
  const reqParams = req.body;
  try {
    const updatedProject = await Project
      .findOneAndUpdate({_id: projectId}, {name: reqParams.name, desc: reqParams.desc}, {new: true})
      .exec();
    return res.status(200).json(updatedProject);
  } catch (e) {
    return res.status(401).json(e);
  }
};

// when a delete operation is made, it will first try to remove the project reference in user model's project lists
// then it will try to delete the task lists the project owns
// since a hook is defined in tasklist, so the tasks will related to a project will also be removed
exports.deleteProject = async function (req, res) {
  const projectId = req.params.id;
  try {
    const deletedProject = await Project.findOneAndDelete({_id: projectId}).exec();
    return res.status(200).json(deletedProject);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.getProjectById = async (req, res) => {
  const projectId = req.query.id;
  if (projectId) {
    try {
      const project = await Project.findOne({_id: projectId}).exec();
      return res.status(200).json(project);
    } catch(e) {
      return res.status(401).json(e);
    }
  }
};

exports.getProjectsByUserId = async function (req, res) {
  const userId = req.query.userId;
  if (userId) {
    try {
      const projects = await Project.find({users: userId}).exec();
      return res.status(200).json(projects);
    } catch (e) {
      return res.status(401).json(e);
    }
  }
};

exports.updateProjectUsers = async function (req, res) {
  const projectId = req.body.projectId;
  const projectMembers = req.body.inviteUsers.map(u => u._id);
  if (projectId && projectMembers) {
    try {
      const updatedProject = await Project
        .findOneAndUpdate({_id: projectId}, {users: projectMembers}, {new: true})
        .exec();
      return res.status(200).json(updatedProject);
    } catch (e) {
      return res.status(401).json(e);
    }
  }
};

