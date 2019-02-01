const redis = require("redis").createClient();
const config = require('../config/config');

function Redis() {
  let self = this;

  self.client = redis;

  self.send = (key, obj) => {
    return new Promise( (resolve, reject) => {
      self.client.LPUSH(key, obj, function( err, reply ) {
        if ( err )
          reject( err );
        else
          resolve( reply );
      });
    });
  };

  self.recv = (key, timeout) => {
    return new Promise( (resolve, reject ) => {
      self.client.BRPOP( key, timeout, function( err, reply ) {
        if ( err )
          reject(err);
        else
          resolve(reply);
      });
    });
  };
}

module.exports = new Redis();
