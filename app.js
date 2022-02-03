require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { celebrate, Joi, errors } = require('celebrate');

const { configServer } = require('./utils/config');
const { limiter } = require('./utils/limiter');
const {
  internalServerErrorText,
  notFoundPathErrorText,
  serverStartedText,
} = require('./utils/constantsText');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { auth } = require('./middlewares/auth');

const { createUser, login, logout } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');

const {
  PORT = configServer.PORT,
  MONGO_DB = configServer.MONGO_DB,
} = process.env;

const app = express();

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);
app.use(cors);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post('/signout', logout);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('*', (req, res, next) => {
  next(new NotFoundError(notFoundPathErrorText));
});

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? internalServerErrorText : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(serverStartedText);
});
