import "dotenv/config";

import express from 'express'
import passport from 'passport'
import session from 'express-session'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import mongoose from 'mongoose'
import User from "./models/User.js";

const mongoURL = process.env.MONGO_URL

if (!mongoURL) {
    console.error("Ошибка: MONGO_URL не найден в .env!");
    process.exit(1);
}

mongoose
    .connect(mongoURL) // Убрали старые параметры
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express()

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
})) // secret: key that can decrypt session data, resave: saves session after each request, 
// saveUnit: session creates for users who are not logged in yet

app.use(passport.initialize()) // init passport 
app.use(passport.session()) // it allows stay logged in after reloading page

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5555/auth/google/callback",
},
    async (accessToken, refreshToken, profile, done) => {
        try {

            var user = await User.findOne({ googleId: profile.id })

            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    name: profile.DisplayName,
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

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

app.get('/', (req, res) => {
    res.send("<a href='/auth/google'>Login with Google</a>")
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile')
})

app.get('/profile', (req, res) => {
    res.send(`Welcome ${req.user.displayName}`)
})

app.get('/logout', (req, res) => {
    req.logout(()=> {
        
    })
})

app.listen(5555, () => {
    console.log('Server is OK')
})