const express = require("express");
const url = require("url");
const passport = require("passport");
const { SlackEvent } = require("../models");

const router = new express.Router();

// TODO: filter by domain
router.get("/", passport.authenticate('jwt', { session: false}), (req, res) => {
  // We can access all the slack events we've recorded
  const url_parts = url.parse(req.url, true);
  const { start, stop } = url_parts.query;

  const constraints = {};
  if(start){
    constraints.ts = constraints.ts || {}
    constraints.ts["$gte"] = +start;
  }
  if(stop){
    constraints.ts = constraints.ts || {}
    constraints.ts["$lte"] = +stop;
  }

  SlackEvent.find(constraints).then((events) => {
    res.json(events);
  });

})

module.exports = router;
