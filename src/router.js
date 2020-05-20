import { Router } from 'express';
import * as Events from './controllers/event-controller';
// import { requireAuth, requireSignin } from './services/passport';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Greentrace\'s API!' });
});


router.route('/events')
  .get(Events.getEvents)
  .post(Events.addEvent);

export default router;
