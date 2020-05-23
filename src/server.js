import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as Observations from './controllers/observation-controller';
import * as User from './controllers/user-controller';
import apiRouter from './router';

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://heroku_lp9s4k0k:pce2ncfhrbohsivej0ej2btont@ds215388.mlab.com:15388/heroku_lp9s4k0k';
mongoose.connect(mongoURI);

// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// additional init stuff should go before hitting the routing
app.use('/api', apiRouter);

// default index route
app.get('/', (req, res) => {
});

app.post('/location', (req, res) => {
  Observations.addEvent(req, res);
});

app.put('/user/:id', (req, res) => {
  User.updateUser(req, res);
});

app.get('/user/:id/', (req, res) => {
  User.getMessages(req, res);
});


// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
