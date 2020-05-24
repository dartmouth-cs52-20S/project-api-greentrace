import Observation from '../models/observation-model';

export const addObservation = (req, res) => {
  const observation = new Observation();
  observation.sourceUserID = req.body.sourceUserID;
  observation.location.type = 'Point';
  observation.location.coordinates = [req.body.longitude, req.body.latitude];
  observation.dataCollectionTimestamp = req.body.dataCollectionTimestamp;
  observation.save()
    .then(((result) => {
      res.json({ message: 'added a location' });
    }))
    .catch((error) => {
      // we'll have implement some sort of more robust error-handling here
    });
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
