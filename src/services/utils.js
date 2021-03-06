import User from '../models/user-model';
import Observation from '../models/observation-model';


export const defaultSymptoms = {
  persistantCough: false,
  shortnessOfBreath: false,
  hasFever: false,
  hasChills: false,
  musclePain: false,
  soreThroat: false,
  lossOfTaste: false,
  lossOfSmell: false,
};

export const symptomScorer = {
  persistantCough: 1,
  shortnessOfBreath: 1,
  hasFever: 1,
  hasChills: 1,
  musclePain: 1,
  soreThroat: 1,
  lossOfTaste: 1,
  lossOfSmell: 1,
};

export const riskScorer = (user) => {
  let numSymptoms = 0;
  Object.keys(user.symptoms).forEach((symptom) => {
    if (user.symptoms[symptom]) {
      numSymptoms += 1;
    }
  });
  if (user.tested) {
    if (user.covid) {
      // positive test
      return 7;
    } else if (!user.covid && numSymptoms === 0) {
      // low danger
      return 1;
    } else if (!user.covid && numSymptoms <= 4) {
      // low danger
      return 2;
    } else if (!user.covid && numSymptoms > 4) {
      // high danger
      return 5;
    }
  } else if (!user.tested) {
    if (numSymptoms === 0) {
      return 3;
    } else if (numSymptoms <= 4) {
      return 4;
    } else {
      // high danger
      return 6;
    }
  }
  return 0;
};

export const getNumPeopleTested = (req, res) => {
  return User.find({ tested: true })
  // eslint-disable-next-line consistent-return
    .then((users) => {
      const numTested = users.length;
      return res.json({ message: numTested });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};


// below is all the heatmap code from user-controller.js, but updated with es6 syntax

// if it is the first call set locations to empty array
// if we have reached the end of users callback with locations array
// else get first element in users array find all observations in this array and concat with current locations array
// recurse with new locations array and users array of len-1
const addAllLocations = (users, callback, locations) => {
  locations = locations || [];
  if (users.length < 1) {
    callback(null, locations);
  } else {
    const user = users.shift();
    let cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 10);
    // converts Date back to unix timestamp to compare
    cutoff = cutoff.getTime() / 1000;
    // eslint-disable-next-line consistent-return
    Observation.find({ sourceUserID: user.id, dataCollectionTimestamp: { $gte: cutoff } }, (err, userlocations) => {
      if (err) {
        return callback(err);
      }
      locations = locations.concat(userlocations);
      addAllLocations(users, callback, locations);
    });
  }
};

const refactorlocations = (locations) => {
  const newlocations = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < locations.length; i++) {
    const latitude = locations[i].location.coordinates[1];
    const longitude = locations[i].location.coordinates[0];
    newlocations.push({ latitude, longitude, weight: 1 });
  }
  return newlocations;
};

// Find all users that have tested positive
// call addAllLocations with users found
export const getHeatmap = (req, res) => {
  User.find({ covid: true })
    .then((users) => {
      addAllLocations(users, (err, locations) => {
        if (err) {
          return res.status(500).send({ err });
        } else {
          return res.json({ message: refactorlocations(locations) });
        }
      });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const getNumPositive = (req, res) => {
  User.find({covid:true})
    .then((result) => {
      if (result !== null){
        const num = result.length;
        return res.json({message: num})
      }
    })
    .catch((err) => {
      console.log('oops');
      return res.status(500).send({err})
    })
}
