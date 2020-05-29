# Greentrace Server

![Team Photo](https://raw.githubusercontent.com/dartmouth-cs52-20S/project-greentrace/master/selfie.png?token=AMMHK67VCIRS264KTSYFM5K62Z46S)

The backend for [Greentrace](https://github.com/dartmouth-cs52-20S/project-greentrace), a contact-tracing application designed for Darmtouth College. Built with [node.js](https://nodejs.org/en/), [express](https://expressjs.com/), and a [MongoDB](https://www.mongodb.com/) database.

Features a User model to manage data for individual students and and Event model to handle contact tracing based on users' interactions with each other and changes in location.

User authentication and security is handle by [passport.js](http://www.passportjs.org/).

API in the [wiki](https://github.com/dartmouth-cs52-20S/project-api-greentrace/wiki)

## Architecture

```
.
├── Procfile
├── README.md
├── package.json
├── src
│   ├── controllers
│   │   ├── observation-controller.js
│   │   └── user-controller.js
│   ├── models
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

## Setup

To fetch and download dependencies, run `yarn`

To start the server locally, run `yarn dev`

## Deployment

Deployed on [Heroku](https://greentrace-server.herokuapp.com/).

## Authors

Samiha Datta, Srishti Bagchi, David Kantor, Hershel Wathore, Aditya Choudhari, Zack Gottesman

## Acknowledgments
