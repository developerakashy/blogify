import { Router } from "express";
import path from 'path'
import multer from "multer";
import Blog from "../models/blog.js";
const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })

router.get('/addblog', (req, res) => {
    res.render('addblog', {
        user: req.user
    })
})


router.post('/add', upload.single('coverImage'), async (req, res) => {
    const { title, body} = req.body

    await Blog.create({
        title,
        body,
        coverImageUrl: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })

    return res.redirect('/')
})

export default router
