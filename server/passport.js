const passport    = require('passport');
const passportJWT = require("passport-jwt");
const config = require('./config/config')
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const mongoose = require('mongoose');
const userModel = require('./models/user');

  let _User = userModel;
  passport.use(new LocalStrategy({
          usernameField: 'user',
          passwordField: 'password'
      },
      function (userName, password, done) {
          //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
          return _User.findOne({name: userName, password: password})
              .then( user => {
                if (!user)
                  return done(null, false, {message: "Incorrect user name."});
                return done(null, user, {message: 'Logged In Successfully'});
              })
              .catch( err => {
                return done(err);
              });
      }
  ));

  let cookieExtractor = function(req) {
      var token = null;
      if (req && req.cookies)
      {
          token = req.cookies['session'];
      }
      return token;
  };

  passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token'),
        secretOrKey   : config.jwt.privateKey
    },
    function (jwtPayload, cb) {
        const ObjectId = mongoose.Types.ObjectId;
        //find the user in db if needed
        return _User.findOne( { _id: new ObjectId(jwtPayload._id) } )
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
  ));
