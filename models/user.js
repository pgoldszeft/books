function User( mongoDb ){
  const self = this;

  let Schema = mongoDb.mongoose.Schema;
  let UsersSchema = new Schema(
    {
      name: String,
      password: String,
      role: { type: Schema.Types.ObjectId, ref: 'roles'}
    }
  );

  return mongoDb.mongoose.model('users', UsersSchema);
}

module.exports = User;
