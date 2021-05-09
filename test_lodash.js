// https://zetcode.com/javascript/lodash/
const _ = require("lodash")

let obs = [{n: 12}, {n: -4}, {n: 4}, {n: -11}]

const min = _.minBy(obs, 'n')
console.log(min)

const max = _.maxBy(obs, 'n')
console.log(max)

let words = ['sky', 'forest', 'wood', 'sky', 'rock', 'cloud', 
  'sky', 'forest', 'rock', 'sky']

let tally = _.reduce(words, (total, next) => {

  total[next] = (total[next] || 0) + 1 

  return total
}, {})


console.log(tally)


const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }  
]

let result = _.reduce(blogs, (total, next) => {

  total[next.author] = (total[next.author] || 0) + next.likes
  
  return total
}, {})
  

console.log(result)
const mostBlogName = _.maxBy(Object.keys(result), o => result[o])
console.log('mostBlogName',mostBlogName)
const mostBlog = {
  'author' : mostBlogName,
  'likes' : result[mostBlogName]
}
console.log('mostBlog',mostBlog)

result = _.reduce(blogs, (total, next) => {
//   total['author'] = next.author
//   total['blogs'] = (total[next.author] || 0) + 1
//   total['likes'] = (total[next.author] || 0) + next.likes

  total[next.author] = (total[next.author] || 0) + + 1
  return total
}, {})

console.log(result)

const mostLikesName = _.maxBy(Object.keys(result), o => result[o])
console.log('mostLikesName',mostLikesName)
const mostLikes = {
  'author' : mostLikesName,
  'blogs' : result[mostLikesName]
}
console.log('mostLikes',mostLikes)