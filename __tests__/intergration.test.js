const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const connection = require('../db/connection');
const endpoints = require('../endpoints.json');

beforeEach(() => seed(data));
afterAll(() => connection.end());

describe('GET api/topics', () => {
  test('get 200: sends an array of all topics to client', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe('string');
          expect(typeof topic.slug).toBe('string');
        });
      });
  });
});

describe('GET api', () => {
  test('get 200: should return an object describing all api endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.api).toEqual(endpoints);
      });
  });
});

describe('GET /api/articles/:article_id', () => {
    test('get 200: should return an article as specified by its ID', () => {
        const output = [{"article_id": 2, "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700", "author": "icellusedkars", "body": "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.", "created_at": "2020-10-16T05:03:00.000Z", "title": "Sony Vaio; or, The Laptop", "topic": "mitch", "votes": 0}]
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body}) => {
            expect(body.article.length).toBe(1)
            expect(body.article).toEqual(output)
        })
    });
    test('get 404: should return an appropriate error message when passed an article id that returns no results', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('No results Found')
        })
    });
    test('get 400: should return an error when passed an invalid article_id', () => {
        return request(app)
        .get('/api/articles/apple')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
});

describe('GET /api/aricles', () => {
  test('200: should return list of all articles in decending date order, with a comment count and no body', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
        expect(body.articles.length).toBe(13)
        expect(body.articles).toBeSortedBy('created_at',{descending: true})
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id:expect.any(Number),
            topic:expect.any(String),
            created_at:expect.any(String),
            votes:expect.any(Number),
            article_img_url:expect.any(String),
            comment_count: expect.any(String)
          })
          expect(article).not.toHaveProperty('body')
        })
    })
  });
});
describe('GET /api/articles/:article_id/comments', () => {
  test('200: returns all comments for provided article parameter, by most reacent', () => {
    return request(app)
    .get('/api/articles/9/comments')
    .expect(200)
    .then(({body}) => {
        expect(body.comments.length).toBe(2)
        expect(body.comments).toBeSortedBy('created_at', {descending: true})
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id : expect.any(Number),
            votes : expect.any(Number),
            created_at : expect.any(String),
            author : expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          })
        })})
    })
    test('200: empty array when article has no comments', () => {
      return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({body}) => {
          expect(body.comments.length).toBe(0)
          expect(body.comments).toEqual([])
      })
  })
  test('400: returns error when article_id does not exist', () => {
    return request(app)
    .get('/api/articles/999/comments')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('No results Found')
  })
});
})
