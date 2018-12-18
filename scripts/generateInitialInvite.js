const dotenv = require("dotenv");
const uuidv4 = require("uuid/v4")
const mongoose = require("mongoose");
const moment = require("moment");
const { Invite, User } = require("../models");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/slackEvents";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => {
  User.countDocuments().then(userCount => {
    if(userCount === 0){
      // build an invite with our default address
      Invite.create({
        code: uuidv4(),
        expires: moment().add(1, "days").format("x"),
        used: false,
        invitee_email: process.env.INITIAL_EMAIL
      }).then(() => {
        mongoose.connection.close();
      });
    }
  })
});
