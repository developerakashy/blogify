import express from 'express'
import path from 'path'
import connectDB from './connection.js'
import { checkForAuthentication } from './middlewares/authentication.js'
import cookieParser from 'cookie-parser'

import userRoute from './routes/user.js'
import blogRoute from './routes/blog.js'
import Blog from './models/blog.js'
import { timeStamp } from 'console'

const PORT = 8000
const app = express()

connectDB('mongodb://localhost:27017/blogify')
.then(() => console.log("MongoDB connected"))

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
