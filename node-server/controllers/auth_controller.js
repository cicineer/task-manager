/**
 * status code: -10 missing required fields from the request body
 * status code: -20 not authenticated no user matching the provided email and password
 * status code: -30 no data from the request
 * status code: -40 duplicated data
 * status code: -1 thrown error
 * status code: 1 successful responses
 */

const nodeMailer = require('nodemailer');
const {findUserAndUpdate} = require('../model/user_model');
const jwt = require('jsonwebtoken');
const userModel = require('../model/user_model');


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
  if (req.body.params) {
    const {email, password} = req.body.params;
    if (email && password) {
      try {
        const user = await userModel.findUser({email, password});
        if (user) {
          const token = jwt.sign({username: user.name}, 'angular_taskmgr_jwttoken', {expiresIn: 60 * 60 * 72});
          return res.status(200).json({
            message: 'user found', data: {
              token: token, user: user, statusCode: 1
            }
          });
        } else {
          return res.status(401).json({message: 'no user found', data: {statusCode: -20}});
        }
      } catch (e) {
        return res.status(401).json(e)
      }
    } else {
      return res.status(401).json({message: 'email or password missing', data: {statusCode: -10}})
    }
  } else {
    return res.status(401).json({message: 'no email and password', data: {statusCode: -30}})
  }
};

exports.register = async (req, res) => {
  if (req.body.user) {
    const userInfo = req.body.user;
    const {email, name, password, dateOfBirth, avatar} = userInfo;
    if (email && name && password && dateOfBirth && avatar) {
      let userExistsOfName;
      let userExistsOfEmail;
      try {
        // userExistsOfName = await userModel.findUser({name: userInfo.name});
        // userExistsOfEmail = await userModel.findUser({email: userInfo.email});
        [userExistsOfName, userExistsOfEmail] = await Promise.all([
          await userModel.findUser({name: userInfo.name}),
          await userModel.findUser({email: userInfo.email})
        ]);
        if (userExistsOfEmail || userExistsOfName) {
          return res.status(401).json({message: 'user already exists', data: {statusCode: -40}})
        } else {
          const newUser = {
            email: userInfo.email,
            name: userInfo.name,
            password: userInfo.password,
            dateOfBirth: userInfo.dateOfBirth,
            avatar: userInfo.avatar
          };
          // important to sync with the test otherwise the test will fail
          const savedUser = await userModel.saveUser(newUser);
          return res.status(200).json({message: 'user created', data: {user: savedUser, statusCode: 1}});
        }
      } catch (e) {
        return res.status(401).json({message: 'Error', data: {errorMessage: e.toString(), statusCode: -1}});
      }
    } else {
      return res.status(401).json({message: 'missing required property', data: {statusCode: -10}})
    }
  } else {
    return res.status(401).json({message: 'no user data is provided', data: {statusCode: -30}})
  }
};

exports.reset = async (req, res) => {
  const {userId, password} = req.body;
  if (userId && password) {
    try {
      const foundUser = await userModel.findUser({_id: userId});
      if (foundUser) {
        const user = await userModel.findUserAndUpdate({_id: userId}, {password: password});
        return res.status(200).json({message: 'password has been reset', data: {user: user, statusCode: 1}})
      } else {
        return res.status(401).json({message: 'user does not exist with given ID', data: {statusCode: -20}})
      }
    } catch (e) {
      return res.status(401).json({message: 'Error', data: {errorMessage: e.toString(), statusCode: -1}});
    }
  } else {
    return res.status(401).json({message: 'no data is provided to reset password', data: {statusCode: -30}})
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



