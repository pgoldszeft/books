function User( mongoDb ){
  const self = this;

  let Schema = mongoDb.mongoose.Schema;
  let RolesSchema = new Schema(
    {
      name: String,
      permissions: [String]
    }
  );

  return mongoDb.mongoose.model('roles', RolesSchema);
}

module.exports = User;
