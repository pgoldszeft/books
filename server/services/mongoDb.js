const mongoose = require('mongoose');
const config = require('../config/config');
//const promise = require('promise');

function MongoDb() {
  const self = this;

  self.connected = false;
  self.connect = async (url) => {
    try {
      if ( !self.connected ){
        await mongoose.connect(url, {useNewUrlParser: true});
        self.connected = true;
        self.mongoose = mongoose;
        self.mongoose.set('debug', config.db.debug);
      }
    } catch( error ){
      console.error("Error connecting to MongoDB: " + error.message);
      throw (error);
    }
  }

  self.connect(config.db.url);
}

module.exports = new MongoDb();
