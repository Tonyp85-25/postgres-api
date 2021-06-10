const pool = require('../pool');
const toCamelCase =require('./utils/to-camel-case');
// module.exports ={

//     find()    
// }

//otherwise 

class UserRepo {
    static async find(){
        const {rows} = await pool.query('SELECT * FROM users;');
        return toCamelCase(rows);
    }

      static findById(){

      }
      static insert(){

      }
      static update(){

      }
      static delete(){

      }
}

module.exports=UserRepo;










