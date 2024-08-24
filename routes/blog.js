import { Router } from "express";
import path from 'path'
import multer from "multer";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
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

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const blogDetails = { ...blog._doc, createdBy: { ...blog._doc.createdBy._doc, password: undefined, salt: undefined}  }

    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy')

    res.render('blog', {
        user: req.user,
        blog: blogDetails,
        comments: comments
    })
})


router.get('/addblog', (req, res) => {
    console.log(req.user)
    res.render('addblog', {
        user: req.user
    })
})

router.post('/comment/:blogId', async (req, res) => {
    const blog = await Blog.findById(req.params.blogId)
    const { content } = req.body

    await Comment.create({
        content,
        createdBy: req.user._id,
        blogId: blog._id
    })

    return res.redirect(`/blog/${req.params.blogId}`)
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
