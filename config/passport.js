// Auth
const passport = require("passport");
const { Strategy:JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");

// configure password
const passportOpts = {
  // Set Extraction method to pull it out from our header
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Our secret
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(
    passportOpts,
    (jwt_payload, done) => {
      console.log(jwt_payload);
      User.findOne({_id: jwt_payload._id}, (err, user) => {
        console.log(user);
        if(err){ return done(err, false); } // if we have a problem remove it
        if(user && user.validated){
          done(null, user);
        } else {
          done(null, false);
        }
      });
    }
));
