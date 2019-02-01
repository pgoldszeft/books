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

  self.mongoModel = mongoose.model('users', UsersSchema);

  self.find = (arg) => {
    return self.mongoModel
                .find(arg)
                .populate('role')
                .exec();
  }

  self.findOne = (arg) => {
    return self.mongoModel
                .findOne(arg)
                .populate('role')
                .exec();
  }

  self.findById = (id) => {
    return self.mongoModel
                .findById(id)
                .populate('role')
                .exec();
  }
}

module.exports = new User();
