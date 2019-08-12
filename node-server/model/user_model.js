const {mongoose, ObjectId, Schema} = require('../config/mongoose_constants');

// User Schema section
const UserSchema = new Schema({
  name: {type: String, required: true},
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


const findUser = (query) => {
  if (query) {
    if (query instanceof Object) {
      if (Object.keys(query).length !== 0) {
        return User.findOne(query).exec(function (err, result) {
          if (err) {
            throw new Error('error find user: ' + err)
          }
          return result;
        })
      } else {
        throw new Error('query is empty')
      }
    } else {
      throw new TypeError('not a query object');
    }
  } else {
    throw new ReferenceError('no query specified')
  }
};

const findUserAndUpdate = (query, update) => {
  return User.findOneAndUpdate(query, update).exec(function (err, result) {
    if (err) {
      throw new Error('error find user and update: ' + err)
    }
    return result;
  })
};

const saveUser = (newUser) => {
  if (newUser) {
    const user = new User(newUser);
    user.save((err, user) => {
      if (err) {
        throw ('user not created: ' + err);
      }
      return user;
    });
  } else {
    throw new TypeError('user is not defined');
  }
};

module.exports = {findUser, findUserAndUpdate, saveUser, User};
