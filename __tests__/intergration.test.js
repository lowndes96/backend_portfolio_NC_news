const app =require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

beforeEach(()=>{seed(data)})
// afterAll(() => db.end())

describe('GET api/topics', () => {
    test('get 200: sends an array of all topics to client', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then (({body}) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')

            });
        })

    })
});