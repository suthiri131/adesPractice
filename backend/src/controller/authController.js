const loginModel = require('../model/authModel');
const bcrypt=require('bcrypt');

const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received login request with email:', email);

    // Retrieve the user from the database by email
    const user = await loginModel.getUserCredentials(email);

    

    if (user) {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        console.log("Login successful");
        console.log(user);

        // Include user data in the response
        return res.status(200).json({ success: true, message: 'Login successful', user });
      } else {
        // Password does not match
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // User not found
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in loginUser controller:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const userCredentialsController=async(req,res)=>{
  try {
    const { email } = req.body;
    console.log('Received credentials request with email:', email);
    const password = await loginModel.getUserCredentials(email);

    if (password) {
      console.log("response success");
      console.log(password);

      // Include user data in the response
      return res.status(200).json({ success: true, message: 'Retrieving successful', password });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email' });
    }
  } catch (error) {
    console.error('Error in userCredentials controller:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}


module.exports = {
  loginUserController,userCredentialsController
};
