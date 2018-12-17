// Next we're going to add an auth
// component so those links are
// unlikely to be tampered with
const mongoose = require("mongoose");
const moment = require("moment");
const inviteSchema = new mongoose.Schema({
  code: {type: String, required: true },
  expires: {type: String, required: true},
  used: {type: Boolean, required: true, default: false },
  invitee_email: { type: String, required: true },
  // this isn't required because we need an inital user
  inviter_id: { type: mongoose.Schema.Types.ObjectId }

  // NOTE: this doesn't VALIDATE the account, it just allows the signup
  // add priveledges still happens later
});

const Invite = mongoose.model("Invite", inviteSchema);
module.exports = Invite;
