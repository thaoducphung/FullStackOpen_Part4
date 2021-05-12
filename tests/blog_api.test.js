const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

// console.log(helper.initialBlogs)
const Blog = require('../models/blogs')
const User = require('../models/user')

// beforeEach(async () => {
//   await Blog.deleteMany({})
  
//   for (let blog of helper.initialBlogs) {
//     let blogObject = new Blog(blog)
//     await blogObject.save()
//   }
// })

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root',name:'root', passwordHash })
  await user.save()
})


describe('when there are initially some blogs saved!', ()=> {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('blogs are returned with correct ammount of blog posts', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  test('check the unique identifier property of the blog posts', async () => {
    const blogObjects = await helper.blogsInDb()
    expect(blogObjects[0].id).toBeDefined()
  })
})

describe('addtion of a new blog', () =>{

  test('a valid blog can be added', async () => {
    // First get the token
    
    const data = await api
      .post('/api/login')
      .send(helper.loginUser)
      .expect(200)
    const token = 'Bearer ' + data.body.token
    // console.log('token',token)

    const newBlog = {
      'title': 'Fisrt Blog',
      'author': 'Phung Duc Thao',
      'url': 'https://helloword.com',
      'likes': 1
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type',/application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        
    //   console.log('blogsAtEnd',blogsAtEnd)
    const blogObjectsEnd = blogsAtEnd.map(n => {
      return {
        'title': n.title,
        'author': n.author,
        'url': n.url,
        'likes': n.likes
      }
    })
    expect(blogObjectsEnd).toContainEqual(newBlog)  
  })
  
  test('a valid blog but invalid token produce 401 error', async () => {
    // First get the token
    
    const data = await api
      .post('/api/login')
      .send(helper.loginUser)
      .expect(200)
    const token = 'Bearer ' + data.body.token + 'a' // Add this to make token WRONG
    // console.log('token',token)

    const newBlog = {
      'title': 'Fisrt Blog',
      'author': 'Phung Duc Thao',
      'url': 'https://helloword.com',
      'likes': 1
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(401)
      .expect('Content-Type',/application\/json/)
  })

  test('test like property missing from request', async ()=> {
    const data = await api
      .post('/api/login')
      .send(helper.loginUser)
      .expect(200)
    const token = 'Bearer ' + data.body.token
    const newBlogNoLike = {
      'title': 'Second Blog',
      'author': 'Phung Duc Thao',
      'url': 'https://helloword.com',
    }
    await api
      .post('/api/blogs')
      .send(newBlogNoLike)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type',/application\/json/)
      
    const blogsAtEnd = await helper.blogsInDb()
    const filterBlog = blogsAtEnd.filter(item => item.title === newBlogNoLike.title 
        && item.author === newBlogNoLike.author
        && item.url === newBlogNoLike.url )
    expect(filterBlog[0].likes).toBeDefined()
    expect(filterBlog[0].likes).toEqual(0)
    
  })
    
  test('test creating new blog with missing title and url from request', async ()=> {
    const data = await api
      .post('/api/login')
      .send(helper.loginUser)
      .expect(200)
    const token = 'Bearer ' + data.body.token
    const newBlogNoLike = {
      'author': 'Phung Duc Thao',
    }
    await api
      .post('/api/blogs')
      .send(newBlogNoLike)
      .set({ Authorization: token })
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    // const blogsAtStart = await helper.blogsInDb()
    // const blogToDelete = blogsAtStart[0]
    // Login first
    const data = await api
      .post('/api/login')
      .send(helper.loginUser)
      .expect(200)
    const token = 'Bearer ' + data.body.token
    // Create a blog and then delete it
    const newBlog = {
      'title': 'Fisrt Blog',
      'author': 'Phung Duc Thao',
      'url': 'https://helloword.com',
      'likes': 1
    }
    const returnedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type',/application\/json/)

    // New blog add then the length is increased
    const blogsAtBegin = await helper.blogsInDb()
    expect(blogsAtBegin).toHaveLength(helper.initialBlogs.length + 1)
    await api
      .delete(`/api/blogs/${returnedBlog.body.id}`)
      .set({ Authorization: token })
      .expect(204)
    // Delete a blog then length decreased
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        
    

    const identifier = blogsAtEnd.map(blog => blog.id)
    expect(identifier).not.toContain(returnedBlog.body.id)
  })

  test('succeeds with status code 400 if id is invalid', async () => {
    await api
      .delete('/api/blogs/123456')
      .expect(400)
  })
})

describe('update of a blog', () => {
  test('updating likes of valid note', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updateValue = {...blogsAtStart[0], likes:1000}
    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(updateValue)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const filterBlog = blogsAtEnd.filter(item => item.title === blogsAtStart[0].title 
            && item.author === blogsAtStart[0].author
            && item.url === blogsAtStart[0].url )
    expect(filterBlog[0].likes).toEqual(1000)
  })
})

afterAll(()=> {
  mongoose.connection.close()
})