const {totalLikes,listWithOneBlog,blogs} = require('../utils/list_helper')

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has 6 blog, equals the likes of that', () => {
    const result = totalLikes(blogs)
    expect(result).toBe(36)
  })

})




