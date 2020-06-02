import Contact from './src/models/contact-model';
import Observation from './src/models/observation-model';

const twoWeeks = (1.2) * (10 ** 9); // two weeks back in milliseconds
const date = new Date();
const currTimestamp = date.now();

function pruneContacts() {
    // find old data in Contacts collection
    Contact.deleteMany({
        initialContactTime: { $lt: (currTimestamp - twoWeeks) }
    })
}

function pruneObservations() {
    // find old data in Observations collection
    Observation.deleteMany({
        dataExitTimestamp: { $lt: (currTimestamp - twoWeeks) }
    })
}

pruneContacts();
pruneObservations();
