import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user-model';

dotenv.config({ silent: true });

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const updateCovidStatus = (req, res, next) => {
  /*
  Eventually, once we figure out how to send a user object/id from the front end in React Native, this with find the user Object that made the request and update their COVID status among the possible options (confirmed positive, showing symptoms, healthy).
  */

  /*
  const { covidStatus } = req.body;
    Post.findOne({_id: req.})
  */
};

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  const { username } = req.body;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide an email, username, and password');
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
        newUser.username = username;
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
