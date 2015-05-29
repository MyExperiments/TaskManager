var express = require('express');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.

var models = require('./models');

function findByEmail(email, fn) {
  models.User.find({
    where: {
      email: email
    }
  }).then(function(user) {
    if (!user) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findById(id, fn) {
  models.User.find({
    where: {
      id: id
    }
  }).then(function(user) {
    if (!user) {
      return fn(new Error('User ' + id + ' does not exist'));
    } else {
      return fn(null, user);
    }
  });
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function() {
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      models.User.find({
        where: {
          email: email
        }
      }).then(function(user) {
        console.log(user);
        if (!user) {
          console.log('No user');
          return done(null, false, {
            message: 'Unknown user '
          });
        } else {
          user.verifyPassword(password, function(err, res) {
            console.log('user present');
            console.log(res);
            if (res) {
              console.log('valid');
              return done(null, user);
            } else {
              console.log('invalid');
              return done(null, false, {
                message: 'Invalid password'
              });
            }
          });
        }
      });
    })
  }));

var bodyParser = require('body-parser')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Sequelize = require("sequelize");
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var expressSession = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  secret: 'ABCXYT$$%^%&^*&44556',
  resave: true,
  saveUninitialized: true
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);

app.get('/login', function(req, res) {
  res.render('sessions/new', {
    user: req.user,
    message: req.session.messages
  });
});

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
// app.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     console.log(user);
//     if (err) {
//       console.log('error');
//       return next(err)
//     }
//     if (!user) {
//       console.log('No User');
//       req.session.messages = [info.message];
//       return res.redirect('/login')
//     }
//     req.logIn(user, function(err) {
//       if (err) {
//         return next(err);
//       }
//       return res.redirect('/users');
//     });
//   })(req, res, next);
// });
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/login'
  })
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

mysql = require('mysql');

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}
module.exports = app;