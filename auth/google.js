import "dotenv/config";

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import User from "../models/User.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5555/auth/google/callback",
},
    async (accessToken, refreshToken, profile, done) => {
        try {

            var user = await User.findOne({ ID: profile.id })

            if (!user) {
                user = await User.create({
                    ID: profile.id,
                    provider: 'google',
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0]?.value || "no photo available",
                })
            }

            return done(null, profile);
        }
        catch (error) {
            return done(error, null)
        }
    }
)
);

export default passport