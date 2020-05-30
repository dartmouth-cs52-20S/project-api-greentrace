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
};

const updateContact = (req, res) => {
  // if there is a previous contact
  // purpose: complete the previous contact with the current time as exit
};

const setExitTimeStamp = () => {
  // if first entry
  //     ignore
  // else
  //     update the last entry's endtime with the current time of the new observation
};

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
