import Observation from '../models/observation-model';
import Contact from '../models/contact-model';

export const addObservation = (req, res) => {
  const observation = new Observation();
  observation.sourceUserID = req.body.sourceUserID;
  observation.location.type = 'Point';
  observation.location.coordinates = [req.body.longitude, req.body.latitude];
  observation.dataCollectionTimestamp = req.body.dataCollectionTimestamp;
  observation.dataExitTimestamp = '';
  observation.save()
    .then(((result) => {
      res.json({ message: 'added a location' });
    }))
    .catch((error) => {
      // we'll have implement some sort of more robust error-handling here
    });
};

const identifyContact = (req, res) => {
// process the current location and determine all observations near the current location within x timeframe
// if there are any results
//    for each result, create a new contact observation 
          // if the results 
//        average the two locations and record the location difference
//        record the current user as the secondary source
//        record the other contact as the primary source
//        record the current time as the initial point of contact
//        set the 
}

export const getDataTimestamp = (req, res) => {
  return req.body.dataCollectionTimestamp;
};

export const getCoords = (req, res) => {
  const { latitude } = req.body;
  const { longitude } = req.body;
  const location = [longitude, latitude];
  return location;
};

// export const deleteObservation = (req, res) => {
//   return Observation.find({/* old timestamp */})
//     .then((post) => {
//       post.remove()
//         .then((result) => {
//         })
//         .catch((error) => {
//           res.status(500).json({ error });
//         });
//     });
// };

export const printWelcome = (req, res) => {
  res.json({ message: 'You can GET locations here' });
};
