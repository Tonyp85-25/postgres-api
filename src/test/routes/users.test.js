const request = require('supertest');
const {randomBytes} =require ('crypto');
const {default:migrate} =require('node-pg-migrate');
const format = require('pg-format');

const buildApp = require('../../app');
const pool = require('../../pool');
const UserRepo = require('../../repository/user-repo');
const {DB_TEST,DB_USER,DB_PASSWORD} = require('../../../local.config')

beforeAll(async()=>{
    //randomly generating a role name
    const roleName = 'a' +randomBytes(4).toString('hex'); //a est ajouté pour que la chaine commence toujours par une lettre

    //connect to pg as usual
   await pool.connect({
        host:'localhost',
        port:5432,
        database:DB_TEST,
        user: DB_USER,
        password:DB_PASSWORD
    });
    //create a new role
    await pool.query(
        format(
            'CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName,roleName
        )
       );
    //create a schema with the same name
    await pool.query(
        format('CREATE SCHEMA %I AUTHORIZATION %I;',roleName,roleName)
    );
    //disconnect entirely from pg
    await pool.close();
    // run migrations in new schema
    await migrate({
        schema:roleName,
        direction:'up',
        log:()=>{},
        noLock:true,
        dir:'migrations',
        databaseUrl:{
            host:'localhost',
            port:5432,
            database:DB_TEST,
            user: roleName,
            password:roleName
        }
    });
    //connect to PG as the newly created role

    await pool.connect({
        host:'localhost',
        port:5432,
        database:DB_TEST,
        user: roleName,
        password:roleName
    });
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