const passport    = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

function Passport(User){
  let _User = User;
  passport.use(new LocalStrategy({
          usernameField: 'user',
          passwordField: 'password'
      },
      function (userName, password, done) {
          //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
          return _User.findOne({user: userName, password: password})
                .exec( (err, user) => {
                    if ( err )
                      return done(err);
                    else {
                      if ( !user )
                        return done(null, false, {message: "Incorrect user name."});
                      return done(null, user, {message: 'Logged In Successfully'});
                    }
                });
                /*
              .then( user => {
                if (!user)
                  return done(null, false, {message: "Incorrect user name."});
                return done(null, user, {message: 'Logged In Successfully'});
              })
              .catch( err => {
                return done(err);
              });
              */
      }
  ));

  passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    function (jwtPayload, cb) {

        //find the user in db if needed
        return UserModel.findOneById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
  ));
}

module.exports = Passport;
