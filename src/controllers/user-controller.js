import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import moment from 'moment';
import User from '../models/user-model';
import { riskScorer } from '../services/utils';
import Contact from '../models/contact-model';

// let counter = 0;

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

  return User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        return res.status(422).send('A user with this email already exists');
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.tested = false;
        newUser.covid = false;
        newUser.symptoms = [];
        newUser.messages = [];
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

export const addMessage = (req, res) => {
  return User.findOne({ _id: req.params.id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      const newMessage = {
        // traceID: req.body.traceID,
        covid: req.body.covid,
        tested: req.body.tested,
        timestamp: moment().format(),
        contactDate: req.body.contactDate,
      };
      user.messages.push(newMessage);
      user.save()
        .then((result) => {
          res.json(user);
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const runTracing = (req) => {
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

  const twoWeeksAgo = (1.2) * (10 ** 9); // two weeks back in milliseconds
  Contact.find({
    $and: [{ primaryUser: req.sourceUserID }, {
      initalContactTimestamp: {
        $gte: (req.contactDate - twoWeeksAgo),
        $lt: (req.contactDate),
      },
    }],
  })
    .then((result) => {
      if (result !== null) {
        const notifiedUsers = [];
        result.forEach((contact) => {
          if (!notifiedUsers.includes(contact)) {
            notifiedUsers.push(contact);
            User.findOne({ _id: contact.contactedUser })
              .then((contactedUser) => {
                if (contactedUser !== null) {
                  addMessage({
                    // traceID: counter,
                    covid: req.covid,
                    tested: req.tested,
                    contactDate: req.contactDate,
                  });
                  // counter += 1;
                  console.log('contacted user NOTIFICATION:', contactedUser);
                }
              })
              .catch((err) => {
                console.log('Error finding contacted user in user database', err);
              });
          }
          // ONCE AGAIN, NEED WAY TO ACCESS THE USER THAT MAY HAVE BEEN EXPOSED
        });
      }
    })
    .catch((error) => {
      console.log('Error finding contacts for infected user', error);
    });
};

export const updateUser = (req, res) => {
  return User.findOne({ _id: req.params.id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if ('tested' in req.body) {
        user.tested = req.body.tested;
      }
      if ('covid' in req.body) {
        user.covid = req.body.covid;
      }
      if ('symptoms' in req.body) {
        user.symptoms = req.body.symptoms;
      }
      user.save()
        .then((result) => {
          if (result.covid) {
            runTracing({
              sourceUserID: result._id,
              contactDate: new Date().getTime(),
              covid: result.covid,
              tested: result.tested,
            });
          }
          res.json(user);
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const getMessages = (req, res) => {
  return User.findOne({ _id: req.params.id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      return res.json({ message: user.messages });
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
      const numContacts = user.messages.length;
      return res.json({ message: numContacts });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const getNumSymptoms = (req, res) => {
  return User.findOne({ _id: req.params.id })
  // eslint-disable-next-line consistent-return
    .then((user) => {
    // calculate risk score
      const numSymptoms = user.symptoms.length;
      return res.json({ message: numSymptoms });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};
