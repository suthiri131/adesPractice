const pool = require('../config/database')

module.exports.getAllUser = async()=>{
    console.log('in test.js model ')
    try{
        sql= "SELECT * FROM users"
        const alluser= await pool.query(sql)
        console.log(alluser.rows)
        return alluser;
    }catch(error){
        console.log('error'+ error)
    }
}
