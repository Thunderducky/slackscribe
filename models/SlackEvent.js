const mongoose = require("mongoose");

const slackEventSchema = new mongoose.Schema({
  ts: { type: Number },
  user: { type: String },
  text: { type: String },
  links: [{
    url: { type:String} ,
    domain: { type:String },
    label: {type: String }
  }],
  channel: { type: String },
  eventType: { type: String }
});

const SlackEvent = mongoose.model("SlackEvent", slackEventSchema);
module.exports = SlackEvent;
