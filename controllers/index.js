const express = require("express");
const bodyParser = require('body-parser')
const auth = require("./authController");
const events =  require("./eventsController");
const slack =  require("./slackController");
const invite =  require("./inviteController");
const user =  require("./userController");

const router = new express.Router();
router.use('/api/slack', slack);      // What slack calls to give us events

// All subsequent routes use bodyParser
const parserRouter = new express.Router();
parserRouter.use(bodyParser.json());
parserRouter.use(bodyParser.urlencoded({ extended: false }));
parserRouter.use('/api/auth', auth);        // Our local auth
parserRouter.use('/api/events', events);    // Our Database of slack events
parserRouter.use('/api/admin/invite', invite);      // Our administrator routes
parserRouter.use('/api/admin/user', user);
router.use(parserRouter);

module.exports = router;
