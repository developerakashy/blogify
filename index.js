import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import connectDB from './connection.js'
import userRouter from './routes/user.js'

const PORT = 8000
const app = express()

connectDB('mongodb://localhost:27017/blogify')
.then(() => console.log("MongoDB connected"))

app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/user', userRouter)

app.get('/', (req, res) => {
    return res.render('homepage')
})



app.listen(PORT, () => console.log(`Server Started ${PORT}`))
