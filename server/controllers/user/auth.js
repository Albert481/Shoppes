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
    done(null, user.id);
});
// deserialize the user
passport.deserializeUser(function (userId, done) {
    User.findByPk(userId).then(function (user, err) {
        if (user) {
            done(null, user.get());
        } else {
            done(err, null);
        }
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URI
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ where: {email: profile.emails[0].value }})
            console.log("user: " + JSON.stringify(user))

            // If user has account
            if (user) { 
                let googleUser = await User.findOne({ where: {googleId: profile.id} })

                // If user has account but associated with other Auth Strategies, update user with googleId
                if (googleUser === null) { 
                    User.update({googleId: profile.id}, { where: { email: profile.emails[0].value}})
                }
                done(null, user);

            } else { // If user no account, create
                User.create({ email: profile.emails[0].value, fname: profile.name.givenName, lname: profile.name.familyName, googleId: profile.id }).then(user => {
                    console.log(JSON.stringify(user))                 
                    done(null, user);        
                }).catch(error => console.log(error))
            }
        } catch(err) {
            console.error(err);
        }
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URI,
    profileFields: ['email', 'first_name', 'last_name']
  },
    async function(accessToken, refreshToken, profile, done) {
        console.log(JSON.stringify(profile))

        try {
            let user = await User.findOne({ where: {email: profile.emails[0].value }})
            console.log("user: " + JSON.stringify(user))

            // If user has account
            if (user) { 
                let fbUser = await User.findOne({ where: {facebookId: profile.id} })

                // If user has account but associated with other Auth Strategies, update user with googleId
                if (fbUser === null) { 
                    User.update({facebookId: profile.id}, { where: { email: profile.emails[0].value}})
                }
                done(null, user);

            } else { // If user no account, create
                User.create({ email: profile.emails[0].value, fname: profile.name.givenName, lname: profile.name.familyName, facebookId: profile.id }).then(user => {
                    console.log(JSON.stringify(user))            
                    done(null, user);        
                }).catch(error => console.log(error))
            }
        } catch(err) {
            console.error(err);
        }
    }
));