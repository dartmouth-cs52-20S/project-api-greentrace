import mongoose from 'mongoose';
import Contact from './src/models/contact-model';
import Observation from './src/models/observation-model';

const twoWeeks = (1.2) * (10 ** 9); // two weeks back in milliseconds
const date = new Date();
const currTimestamp = date.getTime();

const mongoURI = process.env.MONGODB_URI || 'mongodb://heroku_lp9s4k0k:pce2ncfhrbohsivej0ej2btont@ds215388.mlab.com:15388/heroku_lp9s4k0k';
mongoose.connect(mongoURI);
mongoose.Promise = global.Promise;

async function pruneContacts() {
  return Contact.deleteMany({ endContactTime: { $lt: (currTimestamp - twoWeeks) } })
    .then((result) => {
    })
    .catch((error) => {
      console.error(error);
    });
}

async function pruneObservations() {
  return Observation.deleteMany({ dataExitTimestamp: { $lt: (currTimestamp - twoWeeks) } })
    .then((result) => {
    })
    .catch((error) => {
      console.error(error);
    });
}

pruneContacts().then(() => {
  pruneObservations().then(() => {
    process.exit(0);
  });
});
