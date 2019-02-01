const mongoose = require('mongoose');

function Roles( ){
  const self = this;

  let Schema = mongoose.Schema;
  let RolesSchema = new Schema(
    {
      name: String,
      permissions: [String]
    }
  );

  return mongoose.model('roles', RolesSchema);
}

module.exports = Roles();
