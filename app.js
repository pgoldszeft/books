const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const config = require('./config/config');
const mongoDb = require('./services/mongoDb');
const UserModel = require('./models/user');
const RoleModel = require('./models/role');

var user = require('./routes/user');
const auth = require('./routes/auth');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'views')));

//app.use('/', index);
app.use('/user', passport.authenticate('jwt', {session: false}), user);
app.use('/login', auth);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let User;
let Role;

async function initialize() {
  try {
    let mongoose = await mongoDb.connect(config.db.url + '/' + config.db.name, {useNewUrlParser: false});
    User = UserModel(mongoDb);
    Role = RoleModel(mongoDb);

    require('./passport')(User);
  } catch( err ) {
    throw err;
  };
}

async function main(){
  try {
    await initialize();
//    let user = await User.find( { name: 'admin', password: 'admin' })
//                      .populate('role').exec();
//    console.log(JSON.stringify(user));
  } catch( err ){
    console.error("Catched an error.  Exiting...");
  }
}

main();
app.listen(config.server.port, () => console.log(`App listening on port ${config.server.port}!`));
