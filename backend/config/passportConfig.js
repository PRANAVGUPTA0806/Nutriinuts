const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, callback) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          const existingUser = await User.findOne({ email: profile.emails[0].value });
          
          if (existingUser) {
            // If user exists with email but no Google ID, update their profile
            existingUser.googleId = profile.id;
            
            // Add 'google' to authProviders array if not already present
            if (!existingUser.authProviders) {
              existingUser.authProviders = [existingUser.authProvider];
            }
            if (!existingUser.authProviders.includes('google')) {
              existingUser.authProviders.push('google');
            }
            
            // Update other fields
            existingUser.lastLogin = new Date();
            existingUser.name = profile.displayName;
            existingUser.imageUrl = profile.photos[0]?.value || existingUser.imageUrl;
            existingUser.loginCount += 1;
            
            user = await existingUser.save();
          } else {
            // Create new user if neither Google ID nor email exists
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              imageUrl: profile.photos[0]?.value || '',
              authProvider: 'google',
              authProviders: ['google'],
              lastLogin: new Date(),
              loginCount: 1
            });
          }
        } else {
          // Update existing user's information
          user.lastLogin = new Date();
          user.name = profile.displayName;
          user.imageUrl = profile.photos[0]?.value || user.imageUrl;
          user.loginCount += 1;
          await user.save();
        }
        
        return callback(null, user);
      } catch (error) {
        console.error('Google Strategy Error:', error);
        return callback(error, null);
      }
    }
  )
);

// These are crucial for maintaining user session
passport.serializeUser((user, done) => {
  done(null, user.id); // Only store the user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;