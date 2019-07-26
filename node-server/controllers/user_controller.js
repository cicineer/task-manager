const User = require('../model/user_model').User;

exports.getUsersByProjectId = async (req, res) => {
  const projectId = req.query.projectId;
  try {
    const users = await User.find({projects: projectId}).exec();
    return res.status(200).json(users);
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.searchUsersByEmail = async (req, res) => {
  const keyword = req.query.keyword;
  if (keyword) {
    try {
      const users = await User.find({email: new RegExp(keyword)}).exec();
      return res.status(200).json(users);
    } catch (e) {
      return res.status(401).json(e);
    }
  }
};

