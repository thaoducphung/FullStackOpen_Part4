const {favoriteBlog,blogs} = require('../utils/list_helper')

describe('favorite blog', ()=> {

  test('when list has only 6 blog, equals the blog has most likes', () => {
    const result = favoriteBlog(blogs)
    const mostFavorite = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    expect(result).toEqual(mostFavorite)
  })

})