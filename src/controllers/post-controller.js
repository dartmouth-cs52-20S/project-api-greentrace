import Post from '../models/post-model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.tags = req.body.tags.split(', ');
  post.content = req.body.content;
  post.coverUrl = req.body.coverUrl;
  post.save()
    .then((result) => {
      res.json({ message: 'Post created!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getPosts = (req, res) => {
  Post.find({}).sort({ updatedAt: 'desc' })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      res.status(501).json({ error });
    });
};

export const getPost = (req, res) => {
  return Post.findOne({ _id: req.params.id })
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      res.status(502).json({ error });
    });
};

export const deletePost = (req, res) => {
  return Post.findOne({ _id: req.params.id })
    .then((post) => {
      post.remove()
        .then((result) => {
          res.json({ message: 'Post deleted!' });
        })
        .catch((error) => {
          res.status(503).json({ error });
        });
    });
};

export const updatePost = (req, res) => {
  return Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (req.body.title !== '') {
        post.title = req.body.title;
      }
      if (req.body.tags !== '') {
        post.tags = req.body.tags.split(', ');
      }
      if (req.body.content !== '') {
        post.content = req.body.content;
      }
      if (req.body.coverUrl !== '') {
        post.coverUrl = req.body.coverUrl;
      }
      post.save()
        .then((result) => {
          res.json(post);
        })
        .catch((error) => {
          res.status(504).json({ error });
        });
    });
};
