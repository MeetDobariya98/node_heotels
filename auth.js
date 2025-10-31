const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/person'); // Make sure this model exports properly

// Configure local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Find user by username
      const user = await Person.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      // Compare password (make sure comparePassword is defined in your Person model)
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      // Success — user authenticated
      return done(null, user);
    } 
    catch (err) {
      return done(err);
    }
  }
));

// Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user (retrieve full user from ID)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Person.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
