const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// No database — the Google profile itself becomes the "user".
// done(null, user) just hands that plain object to googleCallback in authController.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
      };
      return done(null, user);
    }
  )
);

module.exports = passport;
