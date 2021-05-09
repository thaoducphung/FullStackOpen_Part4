const {mostBlogs,blogs} = require('../utils/list_helper')


describe('Author contains most blog', () => {
  const mostLikeBlog = {
    author: 'Robert C. Martin',
    blogs: 3
  }
  test('when list has 6 blog, the author contains most blog', () => {
    const result = mostBlogs(blogs)
    expect(result).toEqual(mostLikeBlog)
  })
  
})
  
  