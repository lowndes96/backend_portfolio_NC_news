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
    const output = 
      {
        article_id: 2,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        author: 'icellusedkars',
        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: '2020-10-16T05:03:00.000Z',
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        votes: 0,
        comment_count : 0
      }
    ;
    return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject(output);
      });
  });
  test('get 200: should return an article as specified by its ID', () => {
    const output = 
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: "2020-06-06T09:10:00.000Z",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2, 
          votes: 0
      }
    ;
    return request(app)
      .get('/api/articles/9')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(output);
      });
    })
  test('get 404: should return an appropriate error message when passed an article id that returns no results', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('No results Found');
      });
  });
  test('get 400: should return an error when passed an invalid article_id', () => {
    return request(app)
      .get('/api/articles/apple')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('GET /api/aricles', () => {
  test('200: should return list of all articles in decending date order, with a comment count and no body', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty('body');
        });
      });
  });
  test('should return a 200 containing all articles with the provided topic query', () => {
    return request(app)
    .get('/api/articles?filter_by=mitch')
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(12);
      expect(body.articles).toBeSortedBy('created_at', { descending: true });
      body.articles.forEach((article) => {
        expect(article.topic).toBe('mitch');
      });
    });
  });
  test('200: should return an empty array when the provided topic query has no related articles', () => {
    return request(app)
    .get('/api/articles?filter_by=paper')
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toEqual([]);
    });
  });
  test('should return a 404 when the topic query does not exist', () => {
    return request(app)
    .get('/api/articles?filter_by=yellow')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('No results Found');
    })
  });
});


describe('GET /api/articles/:article_id/comments', () => {
  test('200: returns all comments for provided article parameter, by most reacent', () => {
    return request(app)
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
        expect(body.comments).toBeSortedBy('created_at', { descending: true });
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 9
          });
        });
      });
  });
  test('200: should return an empty array when article has no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
        expect(body.comments).toEqual([]);
      });
  });
  test('404: returns error when article_id does not exist', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('No Article Found');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('201: should post a new comment to the article', () => {
    const testComment = { username: 'lurker', body: 'wow, a comment!' };
    return request(app)
      .post('/api/articles/1/comments')
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.newComment).toEqual('wow, a comment!');
      });
  });
  test('400: returns error when comment does not contain the correct catagorys', () => {
    const testComment = { incorrect: 'lurker', notHere: 'wow, a comment!' };
    return request(app)
      .post('/api/articles/1/comments')
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('400: returns error when the user is not listed', () => {
    const testComment = { username: 'Emily', body: 'wow, a comment!' };
    return request(app)
      .post('/api/articles/1/comments')
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('User Not registered');
      });
  });
  test('404: returns error when article does not exist', () => {
    const testComment = { username: 'lurker', body: 'wow, a comment!' };
    return request(app)
      .post('/api/articles/999/comments')
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('No Article Found');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('200: should increase vote count by number specified', () => {
    const newVote = { inc_votes: 1 };
    const updatedArticle = {
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      votes: 101,
      article_img_url:
        'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
    };
    return request(app)
      .patch('/api/articles/1')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual(updatedArticle);
      });
  });
  test('404: should return an appropriate error message when passed an article id that returns no results', () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch('/api/articles/999')
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('No Article Found');
      });
  });
  test('400: should return an appropriate error message when passed a non numerical value as inc_votes', () => {
    const newVote = { inc_votes: 'orange' };
    return request(app)
      .patch('/api/articles/2')
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('400: should return an appropriate error message when passed an invalid article id', () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch('/api/articles/pear')
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
})
describe('DELETE /api/comments/:comment_id', () => {
  test('204: deletes comment and returns no content', () => {
    return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      })
      .then(() => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(10);
          });
      });
  });
  test('404: comment not found', () => {
    return request(app)
      .delete('/api/comments/99')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment Not Found');
      });
  });
  test('400: incorrect ID added should return an error', () => {
    return request(app)
      .delete('/api/comments/papaya')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('GET /api/users', () => {
  test('200: should return list of all users with a username, name and avatar_url property', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      });
  });
});