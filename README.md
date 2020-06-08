# Greentrace Server

![Team Photo](selfie.png)

The backend for [Greentrace](https://github.com/dartmouth-cs52-20S/project-greentrace), a contact-tracing application designed for Darmtouth College. Built with [node express](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/).

Features a User model to manage data for individual students, an Observation model to manage locations visited by users, a Message model to keep track of user messages, a Contact model to handle contact tracing based on users' interactions with each other and changes in location.

User authentication and security is handle by [passport.js](http://www.passportjs.org/). Note that not all of the server's routes require authentication due to the structure of the Greentrace app: if signin/up fails, the user is unable to access the rest of the app.

API in the [wiki](https://github.com/dartmouth-cs52-20S/project-api-greentrace/wiki/API).

## Architecture

```
.
├── package.json
├── pruning.js
├── src
│   ├── controllers
│   │   ├── contact-controller.js
│   │   ├── message-controller.js
│   │   ├── observation-controller.js
│   │   └── user-controller.js
│   ├── models
│   │   ├── contact-model.js
│   │   ├── message-model.js
│   │   ├── observation-model.js
│   │   └── user-model.js
│   ├── router.js
│   ├── server.js
│   └── services
│       ├── passport.js
│       └── utils.js
├── static
│   └── style.css
└── yarn.lock
```

`src` contains all source code for the Greentrace server. We additionally have `pruning.js`, a script that is periodically run by Heroku to delete all observations and user-user contacts that are older than two weeks.

### Notable Dependencies
- [sendgrid](https://github.com/sendgrid/sendgrid-nodejs)
- [random-words](https://www.npmjs.com/package/random-words)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [jwt-simple](https://www.npmjs.com/package/jwt-simple)
- [mongoose](https://mongoosejs.com/)


## Setup

### Local setup

First, clone the repository: `git clone https://github.com/dartmouth-cs52-20S/project-api-greentrace`

To fetch and download dependencies, run `yarn`
To test the server locally, run `yarn dev` from the root directory.

### Deployed server

The most recent release is deployed on [Heroku](https://greentrace-server.herokuapp.com/). Deployments are automatically made when new code is pushed to the master branch of this repository. The Greentrace app makes API calls to this deployed server.

## Authors

Samiha Datta, Srishti Bagchi, David Kantor, Hershel Wathore, Aditya Choudhari, Zack Gottesman

## Acknowledgments
We would like to thank Professor Tim Tregubov for teaching us everything we know about web dev during the course of CS 52 and therefore allowing this project to be a reality. We would also like to thank Alexis Harris for listening to our constant pleas for help fixing bugs and for giving amazing advice about how to build a (we hope!) functional app at this scale.

We also benefitted from the work of many open source project for everything from our entire front end framework to the ability to generate random words for our ID tokens. We cannot name all of them, but Expo, Express, and React Native were particularly useful.
