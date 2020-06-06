import { Router } from 'express';
import * as Observations from './controllers/observation-controller';
import * as User from './controllers/user-controller';
import * as Message from './controllers/message-controller';
import { getNumPeopleTested, getHeatmap, getNumPositive } from './services/utils';
import { requireSignin } from './services/passport';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Greentrace\'s API!' });
});

router.route('/stats')
  .get(getNumPeopleTested);

router.route('/numPositive')
  .get(getNumPositive);

router.route('/heatmap')
  .get(getHeatmap);

router.route('/location')
  .post(Observations.addObservation)
  .get(Observations.printWelcome);

router.route('/user/:id')
  .put(User.updateUser)
  .get(User.getUser);

router.route('/user/:id/risk')
  .get(User.getRiskScore);

router.route('/user/:id/numcontacts')
  .get(User.getNumContactsCovidPositive);

router.route('/user/:id/numSymptoms')
  .get(User.getNumSymptoms)

router.route('/user/:id/messages')
  .get(Message.getMessages)
  .post(Message.addMessageAPI);

router.post('/signin', requireSignin, User.signin); // add requireSignin here, requireAuth elsewhere

router.post('/signup', User.signup);

export default router;
