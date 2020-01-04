const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const baseRoutes = require('./api/routes/base');
const discordUserRoutes = require('./api/routes/discordUser');
const ftCounterRoutes = require('./api/routes/ftCounter');
const royalCounterRoutes = require('./api/routes/royalCounter');
const chipcountRoutes = require('./api/routes/chipcount');
const microstakeRoutes = require('./api/routes/microstakes');
const lowstakeRoutes = require('./api/routes/lowstakes');
const midstakeRoutes = require('./api/routes/midstakes');
const highstakeRoutes = require('./api/routes/highstakes');
const livescoreRoutes = require('./api/routes/livescores');
const moneyRoutes = require('./api/routes/money');

app.use('/', baseRoutes);
app.use('/discordUsers', discordUserRoutes);
app.use('/ftCounter', ftCounterRoutes);
app.use('/royalCounter', royalCounterRoutes);
app.use('/chipcounts', chipcountRoutes);
app.use('/microstakes', microstakeRoutes);
app.use('/lowstakes', lowstakeRoutes);
app.use('/midstakes', midstakeRoutes);
app.use('/highstakes', highstakeRoutes);
app.use('/livescores', livescoreRoutes);
app.use('/money', moneyRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not found.');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => {
  console.log('Server listening at http://localhost:' + port);
});
