const pg =require('pg');

//Normalement on crée un poll de cette manière:
// const pool = new pg.Pool({
//     host:'localhost',
//     port:5432
// });
// module.exports=pool

//Mais comme cela il est difficle de mettre en place des tests se connectant à différentes BDD
//**************************************************************** */

class Pool{
    _pool= null;
    connect(options)
    {
       this._pool= new pg.Pool(options);
       return this._pool.query('SELECT 1+1;');
    }

    close()
    {
       return this._pool.end();
    }

    query(sql,params)
    {
        return this._pool.query(sql,params);
    }
}
module.exports=new Pool()

