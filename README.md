# Greentrace server

![Team Photo](Insert a Team Photo URL here)

The Greentrace server. Communicates with a Mongo database.

#### GET /api/events

- No parameters
- Returns all Event objects that have been added. For an Event instance, `event`, `event.location.coordinates` is an array that contains longitude at index 0 and latitude at index 1. 

#### POST /api/events

- Parameters: An object with `longitude` and `latitude` fields (in that order). Values should be integers or floats.
- Doesn't return anything

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

To fetch dependencies, run `yarn`

To run the server locally, run `yarn dev`

## Deployment

Deployed on [Heroku](https://greentrace-server.herokuapp.com/)

## Authors

Samiha Datta, Srishti Bagchi, David Kantor, Hershel Wathore, Aditya Choudhari, Zack Gottesman

## Acknowledgments
