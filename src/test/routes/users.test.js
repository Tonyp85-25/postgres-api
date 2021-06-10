const request = require('supertest');
const buildApp = require('../../app');
const pool = require('../../pool');
const UserRepo = require('../../repository/user-repo');

beforeAll(()=>{
    return pool.connect({

    })
});

afterAll(()=>{
    return pool.close();
});

//BAD TEST
it('create a user',async()=>{
    const startingCount = await UserRepo.count();
    expect(startingCount).toEqual(0);

    await request(buildApp())
    .post('/users')
    .send({username:'testuser',bio:'test bio'})
    .expect(200);
    const finishCount =await UserRepo.count();
    expect(finishCount).toEqual(1);
})