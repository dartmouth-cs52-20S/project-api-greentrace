/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import randomWords from 'random-words';
import User from '../models/user-model';
import { riskScorer, defaultSymptoms } from '../services/utils';
import { addMessage } from './message-controller';
import Contact from '../models/contact-model';
import Observation from '../models/observation-model';
import sgMail from '@sendgrid/mail';

dotenv.config({ silent: true });

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const signin = (req, res, next) => {
  res.send({
    token: tokenForUser(req.user),
    user: req.user,
  });
};

export const signup = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;

  if (!email || !password) {
    return res.status(422).send('You must provide an email and password');
  }

  // generate wordToken
  const phraseToken = randomWords({ exactly: 2, join: '-' });
  
  return User.findOne({ phraseToken })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        return res.status(422).send('A user has already created an account with this email');
      } else {
        const msg = {
          to: `${email}`,
          from: 'greentracedartmouth@gmail.com',
          subject: 'Your GreenTrace Phrase Token',
          html: `<strong>${phraseToken}</strong>`,
        };

        // send sign-up email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail
          .send(msg)
          .then(() => {}, error => {
            console.error(error);

            if (error.response) {
              console.error(error.response.body)
            }
        });
        // make new user
        const newUser = new User();
        newUser.phraseToken = phraseToken;
        newUser.password = password;
        newUser.tested = false;
        newUser.covid = false;
        newUser.symptoms = defaultSymptoms;
        newUser.risk = 0;
        newUser.save()
          .then((result) => {
            res.send({
              token: tokenForUser(result),
              user: result,
            });
          })
          .catch((error) => {
            return res.status(500).send({ error });
          });
      }
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const runTracing = (req, res) => {
  /* Algorithm:
      User sends a health status indicating positive covid-19 test
      Server receives a health status indicating positive covid-19 test
      Server starts the contact-tracing protocol:
      Assign this trace an ID
      Get all observation instances on file for the infected user
      For each observation:
        Get all userID of users who were near this observation's location and around this observation's timestamp
        For each userID:
          Get the user associated with the userID
          If the user hasn't been notified already for this trace
            Notify this user and mark them notified */

  const twoWeeks = (1.2) * (10 ** 9); // two weeks back in milliseconds

  Contact.find({ primaryUser: req.sourceUserID }).then((results) => {
    const dateCompare = new Date().getTime();
    results.forEach((contact) => {
      if (contact.initialContactTime >= (dateCompare - twoWeeks) && contact.initialContactTime < dateCompare) {
        const notifiedUsers = [];
        if (!notifiedUsers.includes(contact)) {
          notifiedUsers.push(contact);
          User.findOne({ _id: contact.contactedUser })
            .then((contactedUser) => {
              if (contactedUser !== null) {
                addMessage({
                  covid: req.covid,
                  tested: req.tested,
                  contactDate: contact.initialContactTime,
                  userID: contactedUser,
                }, res);
              }
            })
            .catch((err) => {
            });
        }
      }
    });
  });
};

export const updateUser = (req, res) => {
  return User.findOne({ _id: req.params.id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      let covidStatusChanged = false;
      if ('tested' in req.body) {
        user.tested = req.body.tested;
      }
      if ('covid' in req.body) {
        if (user.covid !== req.body.covid) {
          covidStatusChanged = true;
        }
        user.covid = req.body.covid;
      }
      if ('symptoms' in req.body) {
        user.symptoms = req.body.symptoms;
      }
      user.save()
        .then((result) => {
          // if newly covid positive
          if ((result.covid && covidStatusChanged)) {
            runTracing({
              sourceUserID: result._id,
              date: new Date().getTime(),
              covid: result.covid,
              tested: result.tested,
            }, res);
          }
          res.json(result);
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const getUser = (req, res) => {
  return User.findOne({ _id: req.params.id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      return res.json({ message: user });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const getRiskScore = (req, res) => {
  return User.findOne({ _id: req.params.id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      // calculate risk score
      const risk = riskScorer(user);
      return res.json({ message: risk });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const getNumContactsCovidPositive = (req, res) => {
  return User.findOne({ _id: req.params.id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      // calculate risk score
      Message.countDocuments({ userID: user._id, covid: true })
        .then((result) => {
          const numContacts = result;
        })
        .catch((error) => {
          const numContacts = 100;
        }) 
      return res.json({ message: numContacts });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const getNumSymptoms = (req, res) => {
  return User.findOne({ _id: req.params.id })
    .then((user) => {
      let numSymptoms = 0;
      Object.keys(user.symptoms).forEach((symptom) => {
        if (user.symptoms[symptom]) {
          numSymptoms += 1;
        }
      });
      return res.json({ message: numSymptoms });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

// Find all users that have tested positive
// call addAllLocations with users found
export const getHeatmap = (req, res) => {
  User.find({ covid: true }).exec(function (err, users) {
    addAllLocations(users, function (err, locations) {
      if (err) {
        return res.status(500).send({ err });
      } else {
        return res.json({ message: refactorlocations(locations) });
      }
    });
  });
};

// if it is the first call set locations to empty array
// if we have reached the end of users callback with locations array
// else get first element in users array find all observations in this array and concat with current locations array
// recurse with new locations array and users array of len-1
function addAllLocations(users, callback, locations) {
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
    Observation.find({ sourceUserID: user.id, dataCollectionTimestamp: { $gte: cutoff } }, function (err, userlocations) {
      if (err) {
        return callback(err);
      }
      locations = locations.concat(userlocations);
      addAllLocations(users, callback, locations);
    });
  }
}

function refactorlocations(locations) {
  const newlocations = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < locations.length; i++) {
    const latitude = locations[i].location.coordinates[1];
    const longitude = locations[i].location.coordinates[0];
    newlocations.push({ latitude, longitude, weight: 1 });
  }
  return newlocations;
}
