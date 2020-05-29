# Greentrace Server

The Greentrace server. Persists data with MongoDB.

[Server API wiki](https://github.com/dartmouth-cs52-20S/project-api-greentrace/wiki/API)

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

Deployed on [Heroku](https://greentrace-server.herokuapp.com/)

## Authors

Samiha Datta, Srishti Bagchi, David Kantor, Hershel Wathore, Aditya Choudhari, Zack Gottesman

## Acknowledgments
