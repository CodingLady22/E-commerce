import mongoose from "mongoose";
import { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate : {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    role : {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user' 
    }
})


//* Hashing password
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}


const User = mongoose.model('User', userSchema);

export default User;