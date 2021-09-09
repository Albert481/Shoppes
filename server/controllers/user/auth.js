require('dotenv').config();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../../models/User')

const inDevMode = process.env.NODE_ENV === "DEV";

var GOOGLE_CALLBACK_URI = "";
var FACEBOOK_CALLBACK_URI = "";

if (inDevMode) {
    GOOGLE_CALLBACK_URI = process.env.GOOGLE_CALLBACK_URI_DEV
    FACEBOOK_CALLBACK_URI = process.env.FACEBOOK_CALLBACK_URI_DEV
} else {
    GOOGLE_CALLBACK_URI = process.env.GOOGLE_CALLBACK_URI_PROD
    FACEBOOK_CALLBACK_URI = process.env.FACEBOOK_CALLBACK_URI_PROD
}

// serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user[0].id);
});
// deserialize the user
passport.deserializeUser(function (userId, done) {
    User.findByPk(userId).then(function (user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URI
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ where: { email: profile.emails[0].value }, defaults: {fname: profile.name.givenName, lname: profile.name.familyName}}).then(user => {
            console.log(user)                 
            done(null, user);        
        }).catch(error => console.log(error))
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URI,
    profileFields: ['email', 'first_name', 'last_name']
  },
    function(accessToken, refreshToken, profile, done) {
        console.log(JSON.stringify(profile))
        User.findOrCreate({ where: { email: profile.emails[0].value}, defaults: {fname: profile.name.givenName, lname: profile.name.familyName}}).then(user => {
            console.log(user)                 
            done(null, user);        
        }).catch(error => console.log(error))
    }
));