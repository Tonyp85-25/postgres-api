const {randomBytes} =require ('crypto');
const {default:migrate} =require('node-pg-migrate');
const format = require('pg-format');
const {DB_TEST,DB_USER,DB_PASSWORD} =require('../../local.config');
const pool = require('../pool');

class Context{

    static async build(){
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

        return new Context(roleName);
    }

    constructor(roleName){
        this.roleName = roleName;
    }

    async close()
    {
        //disconnect from pg
        await pool.close();
        //reconnect as our root user
        await pool.connect({
            host:'localhost',
            port:5432,
            database:DB_TEST,
            user: DB_USER,
            password:DB_PASSWORD
        })
        //delete the role and schema we created
        await pool.query(
            format('DROP SCHEMA %I CASCADE;',this.roleName)
        );
        await pool.query(
            format('DROP ROLE %I;',this.roleName)
        );
        //disconnect
        await pool.close();
    }

    async reset()
    {
        return pool.query(`
        DELETE * FROM USERS;
        `);
    }
}

module.exports=Context;