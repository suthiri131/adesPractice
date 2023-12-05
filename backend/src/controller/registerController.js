const registerModel = require('../model/registerModel');
const bcrypt=require('bcrypt');
const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const registerUserController = async (req, res) => {
  try {
    const { username, email, password, roleId } = req.body;
    console.log('Received register request with email:', email);
    const hashedPwd = await bcrypt.hash(password, 10);
    const userId = await registerModel.registerUserModel(username,email, hashedPwd, roleId);

    if (userId) {
      console.log("response success");
      console.log(userId);

   
      res.status(200).json({ success: true, message: 'Register successful', userId });
    } else {
        const existingEmail = await registerModel.checkEmailDuplicate(email);
        const existingUsername = await registerModel.checkUsernameDuplicate(username);
  
        if (existingEmail.length > 0) {
          // Email already exists
          res.status(401).json({ success: false, message: 'Email already has an account. Please login.' });
        } else if (existingUsername.length > 0) {
          // Username already exists
          res.status(401).json({ success: false, message: 'Username already exists. Please choose another.' });
        } else {
          // Other error occurred
          res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
      }
  } catch (error) {
    console.error('Error in registerUser controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUserController,
};
