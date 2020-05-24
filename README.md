# Greentrace server

![Team Photo](Insert a Team Photo URL here)

The Greentrace server. Communicates with a Mongo database.

API in the [wiki](https://github.com/dartmouth-cs52-20S/project-api-greentrace/wiki)

## Architecture

```
.
├── Procfile
├── README.md
├── package.json
├── src
│   ├── controllers
│   │   ├── event-controller.js
│   │   └── user-controller.js
│   ├── models
│   │   ├── event-model.js
│   │   └── user-model.js
│   ├── router.js
│   ├── server.js
│   └── services
│       └── passport.js
├── static
│   └── style.css
└── yarn.lock
```

## Setup

To fetch and download dependencies, run `yarn`

To setup the server locally, run `yarn dev`

## Deployment

Deployed on [Heroku](https://greentrace-server.herokuapp.com/)

## Authors

Samiha Datta, Srishti Bagchi, David Kantor, Hershel Wathore, Aditya Choudhari, Zack Gottesman

## Acknowledgments
