const ApiError = require("../error/ApiError");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const userModel = require("../model/userModel");

passport.use(
  new Strategy(
    {
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (verifyAuth = async (payload, done) => {
      try {
        const user = await userModel.getUserById(payload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  )
);

module.exports = passport;
