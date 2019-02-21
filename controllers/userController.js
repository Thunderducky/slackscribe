const express = require("express");
const passport = require("passport");
const { User } = require("../models");

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

router.get("/", (req, res) => {
  User.find({}).select('-password').then(results => res.json(results));
})
// activate a user
router.put("/:user_id/validate", (req, res) => {
  User.update(
    { _id:req.params.user_id, isAdmin: false },
    { validated: true }
  ).then(results => res.json(results));
})
// deactivate a user
router.put("/:user_id/invalidate", (req, res) => {
  User.update(
    { _id:req.params.user_id, isAdmin: false },
    { validated: false }
  ).then(results => res.json(results));
})


module.exports = router;
