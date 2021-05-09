const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

// blogsRouter.get('/', (request, response, next) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
//     .catch(error => next(error))
// })

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// blogsRouter.post('/', (request, response, next) => {
//   const body = request.body
//   const blog = new Blog({
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes
//   })
  
//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
//     .catch(error => next(error))
// })

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })
  const result = await blog.save()
  response.status(201).json(result)
})

// blogsRouter.put('/:id',(req, res, next) => {
//   const body = req.body
//   const blog = {
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes
//   }
//   Blog
//     .findByIdAndUpdate(req.params.id, blog, {new:true})
//     .then(updatedBlog => {
//       res.json(updatedBlog)
//     })
//     .catch(error => next(error))
// })

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new:true})
  res.json(updatedBlog)
})

// blogsRouter.delete('/:id', (req, res, next) => {
//   Blog
//     .findByIdAndRemove(req.params.id)
//     .then(()=> {
//       res.status(204).end()
//     })
//     .catch(error => next(error))
// })

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter