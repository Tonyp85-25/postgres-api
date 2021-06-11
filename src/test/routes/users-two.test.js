const request = require('supertest');
const buildApp = require('../../app');
const pool = require('../../pool');
const UserRepo = require('../../repository/user-repo');
const {DB_TEST,DB_USER,DB_PASSWORD} = require('../../../local.config')

beforeAll(()=>{
    return pool.connect({
        host:'localhost',
        port:5432,
        database:DB_TEST,
        user: DB_USER,
        password:DB_PASSWORD
    })
});

afterAll(()=>{
    return pool.close();
});

//BAD TEST
it('create a user',async()=>{
    const startingCount = await UserRepo.count();
  

    await request(buildApp())
    .post('/users')
    .send({username:'testuser',bio:'test bio'})
    .expect(200);
    const finishCount =await UserRepo.count();
    expect(finishCount-startingCount).toEqual(1);
})