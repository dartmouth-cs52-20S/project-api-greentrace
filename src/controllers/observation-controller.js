import Observation from '../models/observation-model';
import Contact from '../models/contact-model';

const setExitTimeStamp = (object, newTime, res) => {
  console.log('Setting exit time stamp object:', object);
  object.dataExitTimestamp = newTime;
  object.save()
    .then(((result) => {
      // res.json({ message: 'updated exit timestamp' });
      console.log('updated exit timestamp');
    }))
    .catch((error) => {
      // res.json({ message: error });
      console.log('Error in setting exit time stamp:', error);
    });
};

const setEndContactTime = (object, newTime, res) => {
  console.log('Setting end time stamp object:', object);
  object.endContactTime = newTime;
  const duration = newTime - object.initialContactTime;
  object.duration = duration;
  object.save()
    .then(((result) => {
      // res.json({ message: 'updated exit timestamp' });
      console.log('updated contact timestamp');
    }))
    .catch((error) => {
      // res.json({ message: error });
      console.log('Error in setting end contact time:', error);
    });
};

export const addObservation = (req, res) => {
  const observation = new Observation();

  // one hour in milliseconds (will be used to establish the time frame for a contact)
  const largeNumber = 8.64 * (10 ** 7);

  // update previous observation's end time if applicable

  Observation.find({ sourceUserID: req.body.sourceUserID })
    .then((result) => {
      if (result !== null) {
        result.sort((a, b) => { return ((a.dataExitTimestamp < b.dataExitTimestamp) ? 1 : -1); });
        const mostRecent = result[0];
        setExitTimeStamp(mostRecent, req.body.dataCollectionTimestamp, result);
      }
    })
    .catch((error) => {
      console.log('Error! Oh no!', error);
    });

  // update the previous contact's end time if applicable
  Contact.find({ contactedUser: req.body.sourceUserID })
    .then((result) => {
      if (result !== null) {
        result.sort((a, b) => { return ((a.dataExitTimestamp < b.dataExitTimestamp) ? 1 : -1); });
        result.forEach((contact) => {
          if (contact.endContactTime === null) {
            setEndContactTime(contact, req.body.dataCollectionTimestamp);
          }
        });
      }
    })
    .catch((error) => {
      console.log('Error in updating end contact time', error);
    });

  // identify all new contacts based on current location
  Observation.find({
    $and: [{ location: { $near: { $geometry: { type: 'Point', coordinates: [req.body.longitude, req.body.latitude] }, $maxDistance: 2 } } }, {
      dataCollectionTimestamp: { $gte: (req.body.dataCollectionTimestamp - largeNumber), $lt: (req.body.dataCollectionTimestamp) },
    }],
  }).then((result) => {
    if (result !== null && result.length !== 0) {
      result.forEach((obs) => {
        if (obs.dataExitTimestamp !== '' && obs.sourceUserID !== req.body.sourceUserID) {
          const newContact = new Contact();
          const latAverage = Math.abs((obs.location.coordinates[1] + req.body.latitude) / 2);
          const longAverage = Math.abs((obs.location.coordinates[0] + req.body.longitude) / 2);
          const averageLocation = [longAverage, latAverage];
          newContact.location.type = 'Point';
          newContact.location.coordinates = averageLocation;
          newContact.contactedUser = req.body.sourceUserID;
          newContact.primaryUser = obs.sourceUserID;
          newContact.initialContactTime = req.body.dataCollectionTimestamp;
          newContact.endContactTime = '';
          newContact.save()
            .then(((result2) => {
              // res.json({ message: 'added a contact' });
              console.log('added contact');
            }))
            .catch((error) => {
              console.log('error at line 61');
              console.log(error);
              res.json({ message: error });
            });
        } else if (obs.sourceUserID !== req.body.sourceUserID) {
          const newContact1 = new Contact();
          const newContact2 = new Contact();

          const latAverage = Math.abs((obs.location.coordinates[1] + req.body.latitude) / 2);
          const longAverage = Math.abs((obs.location.coordinates[0] + req.body.longitude) / 2);
          const averageLocation = [longAverage, latAverage];
          newContact1.location.type = 'Point';
          newContact1.location.coordinates = averageLocation;
          newContact1.contactedUser = req.body.sourceUserID;
          newContact1.primaryUser = obs.sourceUserID;
          newContact1.initialContactTime = req.body.dataCollectionTimestamp;
          newContact1.endContactTime = null;
          newContact1.save()
            .then(((result2) => {
              res.json({ message: 'added a contact' });
            }))
            .catch((error) => {
              res.json({ message: error });
            });

          newContact2.location.type = 'Point';
          newContact2.location.coordinates = averageLocation;
          newContact2.contactedUser = obs.sourceUserID;
          newContact2.primaryUser = req.body.sourceUserID;
          newContact2.initialContactTime = req.body.dataCollectionTimestamp;
          newContact2.endContactTime = null;
          newContact2.save()
            .then(((result3) => {
              res.json({ message: 'added a contact' });
            }))
            .catch((error) => {
              res.json({ message: error });
            });
        }
      });
    }
    console.log(result);
  })
    .catch((error) => {
      console.log('error', error);
    });

  // add the new observation

  observation.sourceUserID = req.body.sourceUserID;
  observation.location.type = 'Point';
  observation.location.coordinates = [req.body.longitude, req.body.latitude];
  observation.dataCollectionTimestamp = req.body.dataCollectionTimestamp;
  observation.dataExitTimestamp = null;
  observation.save()
    .then(((result) => {
      res.json({ message: 'added a location' });
    }))
    .catch((error) => {
      // we'll have implement some sort of more robust error-handling here
    });
};

// const identifyContact = (observation) => {
// process the current location and determine all observations near the current location within x timeframe
// if there are any results
//    for each result
//        if the fetched result has an end time create a one-way contact
//            average the two locations and record the location difference
//            record the current user as the secondary source
//            record the other contact as the primary source
//            record the current time as the initial point of contact
//            record the end time initially as null
//        else create a two-way contact
//            const contactA (current user as secondary source) = new Contact ()
//            const contactB (current user as primary source) = new Contact ()
//            follow the same process above... subbing in contactA or contactB and making the appropriate changes
//            contactB adjustments: switch primary/secondary source, fetch the other persons timestamp for that location,
//                                  record the end time as the time when
//                                  need to record whether contact is two way or not
//                                  when we update contactA, if it is a two way contact then
//                                      query by switching primary and secondary (.find())
//                                      if there's multiple, just get the one that has no end time, and update it's endtime
//   const largeNumber = 8.64 * (10 ** 7);
//   Observation.find({ coordinates: { $near: [observation.location.longitude, observation.location.latitude], $maxDistance: 2 } }, {
//     dataCollectionTimestamp: { $gte: new Date(parseInt(observation.dataCollectionTimestamp, 10) - largeNumber), $lt: new Date(parseInt(observation.dataCollectionTimestamp, 10)) },
//   });
// };

export const printWelcome = (req, res) => {
  res.json({ message: 'You can GET locations here' });
};
