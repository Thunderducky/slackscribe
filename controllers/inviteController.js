const express = require("express");
const uuidv4 = require("uuid/v4")
const passport = require("passport");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { Invite } = require("../models");

const router = new express.Router();


// All these routes need to be authorized
const isAdminUser = (req, res, next) => {
  console.log("test");
  if(req.user.isAdmin){
    return next();
  } else {
    return res.status(401).send('user is not an admin');
  }
}

router.use(passport.authenticate('jwt', { session: false}))
router.use(isAdminUser);

router.get("/all", (req, res) => {
  Invite.find({}).then(results => {
    res.json(results);
  })
})
router.get("/claimed", (req, res) => {
  Invite.find({ used: true}).then(results => {
    res.json(results);
  })
})
router.get("/unclaimed", (req, res) => {
  Invite.find({ used: false}).then(results => {
    res.json(results);
  })
})

// users are insured to be admin users
router.post("/", (req, res) => {
  const { email } = req.body;
  // TODO
  Invite.create({
    code: uuidv4(),
    expires: moment().add(1, "days").format("x"),
    used: false,
    invitee_email: email
  }).then(result => {
    res.status(200).json(result)
  });
});

router.delete('/:code', (req, res) => {
  Invite.deleteOne({code: req.params.code}, function(err){
    res.status(200).end();
  })
});


module.exports = router;
