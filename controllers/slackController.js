const express = require("express");
const passport = require("passport");
const chalk = require("chalk");
const moment = require("moment");
const url = require("url");
const { createEventAdapter } = require('@slack/events-api');
const { extractLinks } = require("../utils/slackEventHelper");
const { SlackEvent } = require("../models");

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const router = new express.Router();

// this middleware is how we register events
router.use("/event", slackEvents.expressMiddleware());

// when we receive an event, and have validated it
slackEvents.on('message', event => {
  // build some extracted fields
  event.eventType = event.type;
  event.links = extractLinks(event.text);
  console.log(event);
  SlackEvent.create(event).catch(err => console.log(err));
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

module.exports = router;
