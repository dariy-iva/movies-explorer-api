const configServer = {
  PORT: 3000,
  MONGO_DB: 'mongodb://localhost:27017/moviesdb',
  JWT_SECRET: 'dev-secret',
};

module.exports = { configServer };
