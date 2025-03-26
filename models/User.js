import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true},
    name: String,
    email: String,
    photo: String,
})

export default mongoose.model('User', UserSchema)