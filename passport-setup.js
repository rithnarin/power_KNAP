const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const db = require('./database/postgres.js');

passport.serializeUser((user, done) => {
  // give the browser the users google profile id to store in cookie
  done(null, user.id);
});

// passport.deserializeUser((id, done) => {
//   // browser sends back id, we identify the user with it
//     // need to store users in db to use this
// });

passport.use(new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: process.env.GOOGLECLIENTID,
  clientSecret: process.env.GOOGLECLIENTSECRET,
}, (accessToken, refreshToken, profile, done) => {
  return db.Users.findOne({where: {google_id: profile.id} })
    .then(user => {
      if (user) {
        return done(null, profile);
      } else {
        db.saveGoogleUser(profile)
          .then(user => {
            done(null, profile)
          });
      }
    })
    .catch(err => done(err, null));
}));
