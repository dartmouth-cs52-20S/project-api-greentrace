import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as Posts from './controllers/post-controller';
import apiRouter from './router';

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://heroku_3p0lb69r:rlp9tefg8hqjk7jta09irnmvk8@ds333248.mlab.com:33248/heroku_3p0lb69r';
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
  Posts.getPosts(req, res);
});

app.post('/posts', (req, res) => {
  Posts.createPost(req, res);
});

app.get('/posts/:id', (req, res) => {
  Posts.getPost(req, res);
});

app.put('/posts/:id', (req, res) => {
  Posts.updatePost(req, res);
});

app.delete('/posts/:id', (req, res) => {
  Posts.deletePost(req, res);
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
