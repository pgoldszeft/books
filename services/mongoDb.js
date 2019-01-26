const mongoose = require('mongoose');
//const promise = require('promise');

function MongoDb() {
  const self = this;

  self.connected = false;
  self.connect = async (url) => {
    try {
      await mongoose.connect(url);
      self.connected = true;
      self.mongoose = mongoose;
      self.mongoose.set('debug', true);
    } catch( error ){
      console.error("Error connecting to MongoDB: " + error.message);
      throw (error);
    }
  }
}

module.exports = new MongoDb();
