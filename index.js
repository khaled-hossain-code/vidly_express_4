require('dotenv').config();
const config = require('config');
const express = require('express');
const debug = require('debug')('app');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const videoRouter = require('./routes/videos');

const app = express();
const PORT = process.env.PORT || config.get('PORT');
const env = app.get('env');


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// view engine
app.set('view engine', 'pug');

// Middleware in Development Mode
if (env === 'development') {
  app.use(logger('tiny')); // log in console only in development mode
}

// routes
app.use('/api/videos', videoRouter);
app.get('/', (req, res) => {
  res.render('index', { title: 'vidly', message: 'Welcome to vidly App' });
});

app.listen(PORT, () => {
  debug(`App is running on port ${PORT}`);
});
