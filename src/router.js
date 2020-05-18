import { Router } from 'express';
import * as Posts from './controllers/post-controller';
import * as UserController from './controllers/user-controller';
import { requireAuth, requireSignin } from './services/passport';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

router.route('/posts')
  .post(requireAuth, Posts.createPost)
  .get(Posts.getPosts);

router.route('/posts/:id')
  .get(Posts.getPost)
  .put(requireAuth, Posts.updatePost)
  .delete(requireAuth, Posts.deletePost);

router.post('/signin', requireSignin, UserController.signin);

router.post('/signup', UserController.signup);


export default router;
