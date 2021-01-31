require('./models/db');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favion = require('serve-favicon');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var app = express();
require('./config/passport');
// view engine setup
//app.set('views', path.join(__dirname, 'views'));

const hbs = expressHbs.create({
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: {
    check: (lvalue, operator, rvalue, options) => {
      var operators, result;

      if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
      }

      if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
      }

      operators = {
        '==': function (l, r) {
          return l == r;
        },
        '===': function (l, r) {
          return l === r;
        },
        '!=': function (l, r) {
          return l != r;
        },
        '!==': function (l, r) {
          return l !== r;
        },
        '<': function (l, r) {
          return l < r;
        },
        '>': function (l, r) {
          return l > r;
        },
        '<=': function (l, r) {
          return l <= r;
        },
        '>=': function (l, r) {
          return l >= r;
        },
        'typeof': function (l, r) {
          return typeof l == r;
        }
      };

      if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
      }

      result = operators[operator](lvalue, rvalue);

      if (result) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'analisecretkey',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 180 * 60 * 1000
  }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
  //console.log(req.session);
});
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;