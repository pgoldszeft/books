const mongoose = require('mongoose');

require('./role');

function User(){
  const self = this;

  let Schema = mongoose.Schema;
  let UsersSchema = new Schema(
    {
      name: String,
      password: String,
      role: { type: Schema.Types.ObjectId, ref: 'roles'}
    }
  );

  return mongoose.model('users', UsersSchema);
}

module.exports = User();
