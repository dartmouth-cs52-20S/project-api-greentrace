# Lab 5- Server

A server with CRUD API. Can PUT, POST, GET, and DELETE at the specified routes. `updatePost` performs input validation to ensure fields are not empty. Implementing input validation in `createPost` would have been nice (as a way to do server-side form validation) but I ran out of time.

Procfile set up to run on [heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)

## Extra Credit
- posts on homepage are sorted according to modify date
- tags are stored as an array and displayed as chip items
