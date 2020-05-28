import User from '../models/user-model';


export const defaultSymptoms = {
  'persistant cough': false,
  'shortness of breath': false,
  'has fever': false,
  'has chills': false,
  'muscle pain': false,
  'sore throat': false,
  'loss of taste': false,
  'loss of smell': false,
};

export const symptomScorer = {
  'persistant cough': 1,
  'shortness of breath': 1,
  'has fever': 1,
  'has chills': 1,
  'muscle pain': 1,
  'sore throat': 1,
  'loss of taste': 1,
  'loss of smell': 1,
};

export const riskScorer = (user) => {
  if (user.covid && user.tested) { // if tested positive for covid19
    return 1;
  } else if (user.symptoms.length >= 4 || user.messages.length >= 4) { // if user has symptoms or has enough messages
    return 2;
  } else {
    return 3;
  }
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
