import "dotenv/config";

import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'

import User from "../models/User.js";

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, done) => {
        try {

            var user = await User.findOne({ ID: profile.id })

            if (!user) {
                user = await User.create({
                    ID: profile.id,
                    provider: 'github',
                    name: profile.displayName || "No name",
                    mail: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "No email provided",
                    photo: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "No photo available"
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