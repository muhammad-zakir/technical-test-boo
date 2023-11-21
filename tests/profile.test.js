const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { initialProfilesSeeder } = require('../utilities/initialProfilesSeeder');
const request = require("supertest")
const application = require('../application');

describe('Profile Test Suite', () => {
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

  test('Test the GET method with a valid profile identifier from the initial profile seeders', async () => {
    const response = await request(application).get('/1');
    expect(response.statusCode).toBe(200);
  });
  
  test('Test the GET method without a profile identifier', async () => {
    const response = await request(application).get('/');
    expect(response.statusCode).toBe(302);
  });

  test('Test the GET method with an invalid profile identifier', async () => {
    const response = await request(application).get('/4');
    expect(response.statusCode).toBe(404);
  });
  
  test('Test the POST method with a valid body', async () => {
    const response = await request(application).post('/').set('Accept', 'application/json')
      .send({
        name: "Another Martinez",
        description: "Adolph Larrue Martinez IV.",
        mbti: "ISFJ",
        enneagram: "9w3",
        variant: "sp/so",
        tritype: 725,
        socionics: "SEE",
        sloan: "RCOEN",
        psyche: "FEVL"
      });
    expect(response.statusCode).toBe(201);
  });

  test('Test the GET method with a valid profile identifier from the newly created profile', async () => {
    const response = await request(application).get('/4');
    expect(response.statusCode).toBe(200);
  });
  
  test('Test the POST method with an invalid body', async () => {
    const response = await request(application).post('/').set('Accept', 'application/json')
      .send({
        name: "Another Martinez",
        description: "Adolph Larrue Martinez IV.",
        enneagram: "9w3",
        variant: "sp/so",
        tritype: 725,
        socionics: "SEE",
        sloan: "RCOEN",
        psyche: "FEVL"
      });
    expect(response.statusCode).toBe(422);
  });
});