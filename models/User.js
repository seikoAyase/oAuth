import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    ID: { type: String, required: true, unique: true},
    provider: { type: String, required: true },
    name: String,
    email: String,
    photo: String,
})

export default mongoose.model('User', UserSchema)