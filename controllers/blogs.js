const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')

// const jwt = require('jsonwebtoken')

// const getTokenFrom = req => {
//   const authorization = req.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

// blogsRouter.get('/', (request, response, next) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
//     .catch(error => next(error))
// })

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username: 1, name: 1})
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

  // const token = getTokenFrom(request)
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!request.token || !decodedToken.id) {
  //   return response.status(401).json({error: 'token missing or invalid'})
  // }
  // // const user = await User.findById(body.userId)
  // const user = await User.findById(decodedToken.id)
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
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

  // const decodedToken = jwt.verify(req.token, process.env.SECRET)
  // if (!req.token || !decodedToken.id) {
  //   return res.status(401).json({erorr: 'token misisng or invalid'})
  // }
  // // Pass authentication then check user name
  // const user = await User.findById(decodedToken.id)

  const user = req.user
  // Get the user id who create blog
  const blog = await Blog.findById(req.params.id)
  // Check if the username has the right to delete the blog
  if (!user || !blog) {
    return res.status(400).json({error:'Invalid User or Resource does not exist'})
  }
  if (user._id.toString() === blog.user.toString()) {
    // If matched then remove the blog
    await Blog.findByIdAndRemove(req.params.id)
    // Then remove the blog in the user schema
    user.blogs = user.blogs.filter(blogs => blogs.id !== req.params.id)
    await user.save()
    res.status(204).end()
  } else {
    res.status(401).json({error:'Unauthorized Action'})
  }
  
  res.status(204).end()
})

module.exports = blogsRouter