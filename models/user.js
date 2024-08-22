import mongoose, { now, Schema } from "mongoose";
import { randomBytes } from "node:crypto";
const { createHmac } = await import('node:crypto')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }

}, { timestamps: true })

userSchema.pre("save", function (next){
    const user = this

    if(!user.isModified("password")) return

    const salt = randomBytes(16).toString()

    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex")

    this.salt = salt
    this.password = hashedPassword

    next()

})

userSchema.static('matchPassword', async function(email, password){
    const user = await this.findOne({ email })

    if(!user) throw new Error('User not found')

    const salt = user.salt
    const hashedPassword = user.password
    const userProvidedPasswordHash = createHmac('sha256', salt).update(password).digest("hex")

    if(!(hashedPassword === userProvidedPasswordHash)) throw new Error('Incorrect Passord')

    return { ...user._doc, password: undefined, salt: undefined }


})

const User = mongoose.model("user", userSchema)

export default User
