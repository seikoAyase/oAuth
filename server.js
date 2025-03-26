import 'dotenv/config' 

import express from 'express'
import passport from 'passport'
import session from 'express-session'

import './auth/github.js'
import './auth/google.js'
import './auth/index.js'

import mongoose from 'mongoose'

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

// Home page 
app.get('/', (req, res) => {
    res.send(`<a href='/auth/google'>Login with Google</a>
        <br>
        <a href='/auth/github'>Login with GitHub</a>`)
})

// Google auth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile')
})

// GitHub auth
app.get('/auth/github', passport.authenticate('github', { scope: ['profile', 'email'] }))
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile')
})

// Welcome page
app.get('/profile', (req, res) => {
    res.send(`Welcome ${req.user.displayName}`)
})

// Logout 
app.get('/logout', (req, res) => {
    req.logout(()=> {
        
    })
})

app.listen(5555, () => {
    console.log('Server is OK')
})