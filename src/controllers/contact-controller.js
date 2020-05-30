import Contact from '../models/contact-model';

export const addContact = (req, res) => {
  const contact = new Contact();
  contact.locationDifference = req.body.sourceUserID;
  contact.location.type = 'Point';
  contact.location.coordinates = [req.body.longitude, req.body.latitude];
  contact.dataCollectionTimestamp = req.body.dataCollectionTimestamp;
  contact.save()
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
