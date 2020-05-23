import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import moment from 'moment';
import User from '../models/user-model';


dotenv.config({ silent: true });

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
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
            res.send({ token: tokenForUser(result) });
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

export const updateUser = (req, res) => {
  return User.findOne({ email: req.body.email })
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
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const getMessages = (req, res) => {
  return User.findOne({ email: req.body.email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      return user.messages;
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

export const addMessage = (req, res) => {
  return User.findOne({ email: req.body.email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      const newMessage = {
        traceID: req.body.traceID,
        covid: req.body.covid,
        tested: req.body.tested,
        timestamp: moment().format(),
      };
      user.messages.append(newMessage);
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};
