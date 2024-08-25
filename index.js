import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import connectDB from './connection.js'
import { checkForAuthentication } from './middlewares/authentication.js'
import cookieParser from 'cookie-parser'
dotenv.config()

import userRoute from './routes/user.js'
import blogRoute from './routes/blog.js'
import Blog from './models/blog.js'


const PORT = process.env.PORT
const mongoDBUrl = process.env.MONGODB_URI
const app = express()

connectDB(mongoDBUrl)
.then(() => console.log("MongoDB connected"))
.catch(error => console.log(error))

app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(checkForAuthentication('token'))
app.use(express.static(path.resolve('./public')))

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.get('/', async (req, res) => {
    const allblogs = await Blog.find({}).sort({
        timeStamp: -1
    })
    return res.render('homepage', {
        user: req.user,
        blogs: allblogs
    })
})



app.listen(PORT, () => console.log(`Server Started ${PORT}`))
