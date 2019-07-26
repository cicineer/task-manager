const mongoose = require('mongoose'),
// get the Schema of mongoose for creating newones
  Schema = mongoose.Schema,
// get the built-in object id
  ObjectId = Schema.Types.ObjectId;

module.exports = {
  mongoose,
  Schema,
  ObjectId
};
