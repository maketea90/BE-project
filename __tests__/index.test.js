const app = require('../db/app')
const request = require('supertest')
const db = require('../db/connection')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const TestAgent = require('supertest/lib/agent')

afterAll(() => db.end())

beforeEach(() => seed(data))

describe('GET - /api/topics', () => {
    test("status: 200 returns an array of topic objects each with slug and description properties", () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(3)
            body.forEach((topic) => {
                expect(topic).toEqual(expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
            }))
            })
        })
    })
    test("status: 404 path not found", () => {
        return request(app)
        .get('/api/invalid_path')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('path not found')
        })
    })
})
describe.only("GET /api/articles/:article_id", () => {
    test("status: 200 responds with the relevant article object", () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at:  "2020-11-03T09:12:00.000Z",
                votes: 0,
              })
        })
    })
    test("status: 404 resource doesn't exist, path not found", () => {
        return request(app)
        .get('/api/articles/999999999')
        .expect(404)
        .then(({body})=> {
            expect(body.msg).toBe('path not found')
        })
    })
    test("status: 400 invalid id", () => {
        return request(app)
        .get('/api/articles/invalid_id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})