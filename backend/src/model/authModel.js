const pool = require('../config/database');
const config=  require('../config/config')
const jwt = require('jsonwebtoken');



const loginUserModel = async (email, password) => {
  try {
    console.log('Before database query');
    console.log(email, password);
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    console.log('After database query');

    const user = result.rows[0];

    if (user) {
      // Generate a JWT token
      //token = jwt.sign({ first_name: result[0].first_name, last_name: result[0].last_name },
      const token = jwt.sign({ userid: user.id, role: user.role }, config.secretKey, { expiresIn: '24h' });

      console.log("success");
      console.log(user);

      // Include the token in the returned user object
      user.token = token;
     console.log("Token:", user.token);


      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error in loginUser model:', error);
    throw error;
  }
};

const getUserCredentials=async(email)=>{
  try {
    console.log('Before database query');
    console.log(email);
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('After database query');

    const user = result.rows[0];

    if (user) {
      const token = jwt.sign({ userid: user.id, role: user.role }, config.secretKey, { expiresIn: '24h' });

      console.log("success");
      console.log(user);

      // Include the token in the returned user object
      user.token = token;
     console.log("Token:", user.token);

      console.log("success");
    


      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error in getCredentials model:', error);
    throw error;
  }
};
module.exports = {
  loginUserModel,getUserCredentials
};
