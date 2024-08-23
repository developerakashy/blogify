import JWT from "jsonwebtoken";

const secret = '$aka@%*hi'

export function generateTokenForUser(user){
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    }

    const token = JWT.sign(payload, secret)

    return token
}

export function validateToken(token){

    const payload = JWT.verify(token, secret)
    return payload
}

export default  {
    generateTokenForUser,
    validateToken
}
