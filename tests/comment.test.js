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
          mbti: "INFP",
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
  
  test('Test the GET method with a valid profile identifier after another comment has been created', async () => {
    const response = await request(application).get('/comment/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toStrictEqual(2);
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
});