const app = require('./src/app');
const pool = require('./src/pool');
const {DB_USER,DB_PASSWORD} =require('./local.config')

pool.connect({
    host:'localhost',
    port:5432,
    database:'socialnetwork',
    user: DB_USER,
    password: DB_PASSWORD
}).then(()=>{
    app().listen(3005,()=>{
        console.log('Listening on port 3005');
    });
}).catch((err)=>{
    console.error(err);
})

