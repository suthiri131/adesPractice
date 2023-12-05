const pool = require('../config/database');
//const bcrypt = require('bcrypt');

const checkEmailDuplicate = async (email) => {
    try {
      const result = await pool.query(
        'SELECT * FROM public.users WHERE email = $1',
        [email]
      );
  
      return result.rows;
    } catch (error) {
      console.error('Error in checkEmailDuplicate:', error);
      throw error;
    }
  };
  
  const checkUsernameDuplicate = async (username) => {
    try {
      const result = await pool.query(
        'SELECT * FROM public.users WHERE username = $1',
        [username]
      );
  
      return result.rows;
    } catch (error) {
      console.error('Error in checkUsernameDuplicate:', error);
      throw error;
    }
  };

const registerUserModel = async (username, email, password, roleId) => {
  try {
    const duplicateEmail = await checkEmailDuplicate(email);
    const duplicateUsername = await checkUsernameDuplicate(username);

    if (duplicateEmail.length > 0) {
      // If email exists, return an error or handle it as needed
      console.log('Email already has an account. Please login.');
      return null;
    }

    if (duplicateUsername.length > 0) {
      // If username exists, return an error or handle it as needed
      console.log('Username already exists. Please choose another.');
      return null;
    }
    
    console.log('Before database query');
    console.log(username, email, password);

    const result = await pool.query(
      'INSERT INTO public.users (username, email, password, roleid) VALUES ($1, $2, $3, $4) RETURNING userid;',
      [username, email, password, roleId]
    );
    console.log('After database query');

    const userId = result.rows[0].userid;

    if (userId) {
      console.log('Success');
      console.log(userId);
      return userId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error in RegisterUser model:', error);
    throw error;
  }
};

module.exports = {
  registerUserModel,checkEmailDuplicate,checkUsernameDuplicate
};
