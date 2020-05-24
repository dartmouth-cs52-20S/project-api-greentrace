import Observation from '../models/observation-model';

export const addObservation = (req, res) => {
  const observation = new Observation();
  // event.sourceUser = req.body.userID; // req.user;
  observation.location.type = 'Point';
  observation.location.coordinates = [req.body.longitude, req.body.latitude];
  observation.save()
    .then(((result) => {
      // maybe return some sort of success indicator here
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
