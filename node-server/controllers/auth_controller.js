const nodeMailer = require('nodemailer');
const User = require('../model').User;
const jwt = require('jsonwebtoken');
const {secretKey} = require('../constant');

// User Schema
// {
//   name: {type: String, required: true, unique: true},
//   avatar: {type: String, required: true},
//   email: {type: String, required: true, unique: true},
//   dateOfBirth: {type: Date, required: true},
//   password: {type: String, select: false, required: true},
//   // create relationships between Project Model and User Model for population
//   projects: [{type: ObjectId, ref: 'Project', default: []}]
// }

exports.login = async (req, res) => {
  const email = req.body.params.email;
  const password = req.body.params.password;
  try {
    const user = await User.findOne({email, password}).exec();
    if (user) {
      const token = jwt.sign({username: user.name}, secretKey, {expiresIn: 60 * 60 * 72});
      return res.status(200).json({token: token, user: user});
    } else {
      return res.status(404).json({msg: 'username or password not correct'});
    }
  } catch (e) {
    return res.status(401).json(e)
  }
};

exports.register = async (req, res) => {
  const userInfo = req.body.user;
  // console.log(userInfo);
  const existsName = await User.findOne({name: userInfo.name}).exec();
  const existsEmail = await User.findOne({email: userInfo.email}).exec();
  if (existsName || existsEmail) {
    return res.status(401).json({msg: 'email or username has already been taken'})
  } else {
    const newUser = new User({
      email: userInfo.email,
      name: userInfo.name,
      password: userInfo.password,
      dateOfBirth: userInfo.dateOfBirth,
      avatar: userInfo.avatar
    });
    try {
      const user = await newUser.save();
      return res.status(200).json(user)
    } catch (e) {
      return res.status(401).json(e);
    }
  }
};

exports.reset = async (req, res) => {
  const userId = req.body.userModel.userId;
  const password = req.body.userModel.password;
  try {
    const user = await User.findOneAndUpdate({_id: userId}, {password: password}).exec();
    return res.status(200).json(user)
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.forget = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({email: email}).exec();
    if (user) {
      const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ataskmanager@gmail.com',
          pass: 'Xyyzzj23*'
        }
      });
      const mailOptions = {
        from: 'xuyiyu1992@gmail.com',
        to: email,
        subject: 'Reset your password for Angular Task manager',
        html:
        '<h2>Reset your password</h2>' +
        '<p>Please click the link below to reset your password</p>' +
        `<a href="http://localhost:4200/reset/${user._id}" target="_blank">reset</a>` +
        '<br>' +
        '<p>Angular Task manager team</p>'
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          transporter.close();
        } else {
          transporter.close();
          return res.status(200).json('message sent')
        }
      })
    } else {
      return res.status(404).json('no such user found');
    }
  } catch (e) {
    return res.status(401).json(e);
  }
};
