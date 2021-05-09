const {mostLikes,blogs} = require('../utils/list_helper')


describe('blog contains most like', () => {
  const mostLikeBlog = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }
  test('when list has 6 blog, the author contains most like', () => {
    const result = mostLikes(blogs)
    expect(result).toEqual(mostLikeBlog)
  })
  
})
  
  