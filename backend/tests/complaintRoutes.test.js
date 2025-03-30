require('dotenv').config({ path: '.env.test' }); // Load test env variables

const mongoose = require('mongoose');
const request = require('supertest');
const { app, server } = require("../index");
const Complaints = require('../models/Complaints');

describe('Complaints API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  

   afterAll(async () => {
      await mongoose.connection.close();
     if (server) {
         server.close();
     }
 });
 
 
 

  test('GET /api/complaints - should return all complaints', async () => {
   

    const res = await request(app).get('/api/complaints');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('compositeId', 'CM-001');
  });

  
});
