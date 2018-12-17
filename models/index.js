const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/slackEvents";

mongoose.set('useFindAndModify', false);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = {
  Invite: require("./Invite"),
  User: require("./User"),
  SlackEvent: require("./SlackEvent")
};
