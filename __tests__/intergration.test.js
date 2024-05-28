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
