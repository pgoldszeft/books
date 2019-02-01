const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const RedisStore = require('connect-redis')(session)
const redis = require("redis").createClient();
const config = require('./config/config');
const mongoDb = require('./services/mongoDb');
const UserModel = require('./models/user');
const RoleModel = require('./models/role');


require('./passport');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

let store = new RedisStore({
    url: config.redisStore.url,
    logErrors: true,
    client: redis
});

app.use(session({
  store: store,
  name: 'session',
  secret: config.redisStore.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            signed: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('views'));

const user = require('./routes/user');
const auth = require('./routes/auth');
const book = require('./routes/book');

//app.use('/', index);
app.use('/user', passport.authenticate('jwt', {session: false}), user);
app.use('/login', auth);
app.use('/book', passport.authenticate('jwt', {session: false}), book);

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


app.listen(config.server.port, () => console.log(`App listening on port ${config.server.port}!`));
