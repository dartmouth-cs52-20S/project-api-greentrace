import { Router } from 'express';
import * as Observations from './controllers/observation-controller';
import * as User from './controllers/user-controller';
// import { requireAuth, requireSignin } from './services/passport';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Greentrace\'s API!' });
});


router.route('/location')
  .post(Observations.addObservation)
  .get(Observations.printWelcome);

router.route('/user/:did')
  .put(User.updateUser)
  .get(User.getMessages);

router.post('/signin', User.signin); // add requireSignin here, requireAuth elsewhere

router.post('/signup', User.signup);

export default router;
