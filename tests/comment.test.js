const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { initialProfilesSeeder } = require('../utilities/initialProfilesSeeder');
const request = require("supertest")
const application = require('../application');

describe('Comment Test Suite', () => {
  let databaseConnection;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    databaseConnection = await MongoClient.connect(mongoServer.getUri(), {});
    const database = databaseConnection.db('');
    application.set('database', database);
    await initialProfilesSeeder(database);
  });

  afterAll(async () => {
    if (databaseConnection) {
      await databaseConnection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
  
  test('Test the GET method with an invalid profile identifier before any comment is created', async () => {
    const response = await request(application).get('/comment/0');
    expect(response.statusCode).toBe(404);
  });

  test('Test the GET method with a valid profile identifier before any comment is created', async () => {
    const response = await request(application).get('/comment/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test('Test the POST method with a valid body and valid profile identifiers', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "INFP",
          zodiac: "Cancer"
        }
      });
    expect(response.statusCode).toBe(201);
  });
  
  test('Test the GET method with a valid profile identifier after a comment has been created', async () => {
    const response = await request(application).get('/comment/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toStrictEqual(1);
  });
  
  test('Test the POST method with a valid body but has an invalid profile identifiers', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 10,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "INFP",
          zodiac: "Cancer"
        }
      });
    expect(response.statusCode).toBe(404);
  });
  
  test('Test the POST method with a valid body but has an invalid enneagram', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 10,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w2",
          mbti: "INFP",
          zodiac: "Cancer"
        }
      });
    expect(response.statusCode).toBe(422);
  });

  test('Test the POST method with a valid body but has an invalid mbti', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 10,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "THIS",
          zodiac: "Cancer"
        }
      });
    expect(response.statusCode).toBe(422);
  });
  
  test('Test the POST method with a valid body but without an enneagram', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          mbti: "INFP",
          zodiac: "Cancer"
        }
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.enneagram).toBe(null);
  });

  test('Test the POST method with a valid body but without a mbti', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          zodiac: "Cancer"
        }
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.mbti).toBe(null);
  });

  test('Test the POST method with a valid body but without a zodiac', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {
        }
      });
    expect(response.statusCode).toBe(201);
  });

  test('Test the POST method with a valid body but without a single vote', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {}
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.zodiac).toBe(null);
  });

  test('Test the POST method with a valid body but with an invalid vote field', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: 'test'
      });
    expect(response.statusCode).toBe(422);
  });

  test('Test the POST method with a valid body but has an invalid zodiac', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 10,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "INFP",
          zodiac: "Avicenna"
        }
      });
    expect(response.statusCode).toBe(422);
  });

  test('Test the POST method with an invalid body', async () => {
    const response = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "INFP",
          zodiac: "Cancer"
        }
      });
    expect(response.statusCode).toBe(422);
  });
  
  test('Test the POST method for like with a valid body', async () => {
    const createCommentResponse = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "ISTJ",
          zodiac: "Cancer"
        }
      });
    const commentIdentifier = createCommentResponse.body._id;

    const response = await request(application).post('/comment/like').set('Accept', 'application/json')
      .send({
      	commentIdentifier: commentIdentifier,
      	profileIdentifier: 3
      });
    expect(response.statusCode).toBe(200);
  });

  test('Test the POST method for like with a valid body, but run twice so it should unlike it', async () => {
    const createCommentResponse = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "INFP",
          zodiac: "Cancer"
        }
      });
    const commentIdentifier = createCommentResponse.body._id;
    const profileIdentifier = 3;

    const likeResponse = await request(application).post('/comment/like').set('Accept', 'application/json')
      .send({
        commentIdentifier: commentIdentifier,
        profileIdentifier: profileIdentifier
      });
    expect(likeResponse.statusCode).toBe(200);

    const unlikeResponse = await request(application).post('/comment/like').set('Accept', 'application/json')
      .send({
        commentIdentifier: commentIdentifier,
        profileIdentifier: profileIdentifier
      });
    expect(unlikeResponse.statusCode).toBe(200);
    expect(unlikeResponse.body.likes.length).toStrictEqual(0);
  });

  test('Test the POST method for like with a valid body but an invalid comment identifier', async () => {
    const createCommentResponse = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "INFP",
          zodiac: "Cancer"
        }
      });
    const commentIdentifier = createCommentResponse.body._id;

    const response = await request(application).post('/comment/like').set('Accept', 'application/json')
      .send({
        commentIdentifier: commentIdentifier,
        profileIdentifier: 10
      });
    expect(response.statusCode).toBe(404);
  });

  test('Test the POST method for like with a valid body but an invalid comment identifier', async () => {
    const response = await request(application).post('/comment/like').set('Accept', 'application/json')
      .send({
        commentIdentifier: 9,
        profileIdentifier: 3
      });
    expect(response.statusCode).toBe(404);
  });

  test('Test the POST method for like with an invalid body', async () => {
    const response = await request(application).post('/comment/like').set('Accept', 'application/json')
      .send({
        commentIdentifier: 1
      });
    expect(response.statusCode).toBe(422);
  });

  test('Test the GET method with a filter by enneagram', async () => {
    const response = await request(application).get('/comment/1').query({ filter: 'enneagram' });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toStrictEqual(5);
  });

  test('Test the GET method with a filtered by mbti', async () => {
    const response = await request(application).get('/comment/1').query({ filter: 'mbti' });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toStrictEqual(5);
  });

  test('Test the GET method with a filtered by zodiac', async () => {
    const response = await request(application).get('/comment/1').query({ filter: 'zodiac' });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toStrictEqual(6);
  });

  test('Test the GET method with a filtered with an invalid filter', async () => {
    const response = await request(application).get('/comment/1').query({ filter: 'nothing' });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toStrictEqual(8);
  });

  test('Test the GET method sorted by most likes', async () => {
    const response = await request(application).get('/comment/1').query({ sort: 'best' });
    expect(response.statusCode).toBe(200);
    expect(response.body[0].likes).toStrictEqual(1);
  });

  test('Test the GET method sorted by most recent', async () => {
    const createCommentResponse = await request(application).post('/comment').set('Accept', 'application/json')
      .send({
        profileIdentifier: 1,
        voterIdentifier: 2,
        comment: "test",
        votes: {
          enneagram: "2w3",
          mbti: "INFP",
          zodiac: "Cancer"
        }
      });
    const commentTime = createCommentResponse.body.createdAt;

    const response = await request(application).get('/comment/1').query({ sort: 'recent' });
    expect(response.statusCode).toBe(200);
    expect(response.body[0].createdAt).toStrictEqual(commentTime);
  });
});