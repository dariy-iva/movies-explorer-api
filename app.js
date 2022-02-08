require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { errors } = require('celebrate');

const { configServer } = require('./utils/config');
const { limiter } = require('./utils/limiter');
const { serverStartedText } = require('./utils/constantsText');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralErrorHandler = require('./middlewares/centralErrorHandler');

const router = require('./routes/index');

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
app.use(helmet());

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT, () => {
  console.log(serverStartedText);
});
