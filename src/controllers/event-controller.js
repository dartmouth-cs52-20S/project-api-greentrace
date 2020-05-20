import Event from '../models/event-model';

export const getEvents = (req, res) => {
  Event.find({})
    .then((events) => {
      res.json(events);
    })
    .catch((error) => {
      // we'll have implement some sort of more robust error-handling here
    });
};

export const addEvent = (req, res) => {
  const event = new Event();
  event.sourceUser = req.user;
  event.location.type = 'Point';
  event.location.coordinates = [req.longitude, req.latitude];
  event.save()
    .then(((result) => {
      // maybe return some sort of success indicator here
    }))
    .catch((error) => {
      // we'll have implement some sort of more robust error-handling here
    });
};
