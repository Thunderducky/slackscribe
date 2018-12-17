// Next we're going to add an auth
// component so those links are
// unlikely to be tampered with
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  validated: { type: Boolean, required: true, default: false}
  // right now we're going to hand validate users
});

userSchema.pre('save', function(next){
  if(this.isModified(this.password) || this.isNew){
    bcrypt.hash(this.password, 10, (err, hash) => {
      if(err){ return next(err); }
      this.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function(pass){
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, this.password, (err, isMatch) => {
      if(err){
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
