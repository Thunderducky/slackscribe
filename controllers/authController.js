const express = require("express");
const { User, Invite } = require("../models");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const moment = require("moment");

// TODO: BUILD TESTS AROUND SIGNUPS
// SEPERATE THE PIECES BETTER

// PASS IN Invite and User, our index
//will handle the actual models
router.post("/signup", (req, res) => {
  if(!req.body.email || !req.body.password || !req.body.code){
    return res.status(401).send("missing required field(s)");
  }

  Invite
    .findOne({code: req.body.code})
    .then(invite => {
      if(!invite){
        return res.status(401).send("invite not found");
      }
      else if(invite.used){
        return res.status(401).send("invite already claimed");
      }
      else if(req.body.email !== invite.invitee_email){
        return res.status(401).send("email does not match invite code")
      }

      // we have a matching email, so let's create a user account
      User.create({
        email: req.body.email,
        password: req.body.password
      }).then(user => {
          invite.used = true;
          return invite.save();
      }).then(() => {
        res.json({success: true, message: "user account created"})
      })
    });

});



router.post("/login", (req, res) => {
  // We will issue them an auth token, which expires in one day
  const unauthorized = message => {
    return res.status(401).send({
      success: false,
      message: message
    });
  };
  console.log(req.body);
  if(!req.body.email || !req.body.password){
    return unauthorized("username and password required");
  }

  // retrieveUser, which handles all those pieces
  User.findOne({email: req.body.email }).then(user => {
    if(!user){
      return unauthorized("incorrect username or password");
    }

    // Check the password
    user.comparePassword(req.body.password).then(isMatch => {
      if(isMatch){
        // TODO: Add expiration
        const token = jwt.sign({
          _id: user._id                              // encode user id
        }, process.env.JWT_SECRET,
        {
          expiresIn: '23h' // 23 hours in seconds
        });
        return res.json({success: true, message: "JWT " + token});
      } else {
        return unauthorized("incorrect username or password")
      }
    });
  })
});

module.exports = router;
