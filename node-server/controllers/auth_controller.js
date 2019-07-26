const nodeMailer = require('nodemailer');
const { findUser, findUserAndUpdate, saveUser } = require('../model/user_model');
const jwt = require('jsonwebtoken');

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
    const user = await findUser({email, password});
    if (user) {
      const token = jwt.sign({username: user.name}, 'angular_taskmgr_jwttoken', {expiresIn: 60 * 60 * 72});
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
  let userExistsOfName;
  let userExistsOfEmail;
  try {
    userExistsOfName = await findUser({name: userInfo.name});
    userExistsOfEmail = await findUser({email: userInfo.email});
    // [existName, existEmail] = await Promise.all([
    //   await findOne({name: userInfo.name}),
    //   await findOne({email: userInfo.email})
    // ]);
    if (userExistsOfEmail || userExistsOfName) {
      return res.json('user existing')
    } else {
      const newUser = {
        email: userInfo.email,
        name: userInfo.name,
        password: userInfo.password,
        dateOfBirth: userInfo.dateOfBirth,
        avatar: userInfo.avatar
      };
      const savedUser = await saveUser(newUser);
      return res.status(200).json(savedUser);
    }
  } catch (e) {
    return res.json(e);
  }

};

exports.reset = async (req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;
  try {
    const user = await findUserAndUpdate({_id: userId}, {password: password});
    return res.status(200).json(user)
  } catch (e) {
    return res.status(401).json(e);
  }
};

exports.forget = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await findUser({email: email});
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



