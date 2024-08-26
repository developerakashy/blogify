import { validateToken } from "../services/authentication.js"

export function checkForAuthentication(cookieName){
    return (req, res, next) => {

        const cookieToken = req.cookies[cookieName]

        if(!cookieToken){
            req.user = null
            return next()
        }

        try{
            const user = validateToken(cookieToken)
            req.user = user

        }catch(error){

        }

        next()
    }
}
