const multer = require("multer");
const settingsModel = require("../model/settingsModel");
const cloudinary = require("cloudinary").v2; // Include Cloudinary directly
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bcrypt = require('bcrypt');

exports.editProfileController = async (req, res) => {
  const userId = req.params.userId;
  const { username, email, password, newPassword } = req.body;

  try {
    // Hash the new password if provided
    let hashedNewPassword;
    if (newPassword !== null && newPassword !== undefined) {
      hashedNewPassword = await bcrypt.hash(newPassword, 10);
    }

    // Use Promise.all to execute both queries in parallel
    let userUpdateResult;

    if (newPassword === null || newPassword === undefined) {
      // If newPassword is null, insert the existing hashed password
      userUpdateResult = await settingsModel.updateUserDetails(
        username,
        email,
        password, // Use the existing hashed password
        userId
      );
    } else {
      // If newPassword is provided, update with the new hashed password
      userUpdateResult = await settingsModel.updateUserDetails(
        username,
        email,
        hashedNewPassword, // Use the newly hashed password
        userId
      );
    }

    if (userUpdateResult) {
      // The update was successful
      res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
  } catch (error) {
    console.error('Error in editProfile controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



exports.getAllCatController = async (req, res) => {
  try {
    console.log("Fetching categories...");

    // Call the getAllCat method from the settingsModel
    const cat = await settingsModel.getAllCat();

    if (cat) {
      console.log('Categories fetched successfully');
      console.log(cat);

      // Send the categories as a JSON response
      res.status(200).json({ success: true, categories: cat });
    } else {
      console.log('No categories found');

      // Send a response indicating no categories were found
      res.status(404).json({ success: false, message: 'No categories found' });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);

    // Send an error response
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
// controllers/preferencesController.js



exports.updatePreferences = async (req, res) => {
  const { userId } = req.params;
  const { preferences } = req.body;

  try {
    await settingsModel.updatePreferences(userId, preferences);
    res.json({ success: true, message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getPasswordController=async(req,res)=>{
  try{
  const userid=req.params.userid;
  console.log('Received credentials request with userid:', userid);
  const password = await settingsModel.getPassword(userid);

  if (password) {
    console.log("response success");
    console.log(password);

    // Include user data in the response
    return res.status(200).json({ success: true, message: 'Retrieving successful', password });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid userid' });
  }
} catch (error) {
  console.error('Error in getpassword controller:', error);
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
}

}
exports.deleteUserController = async (req, res) => {
  try {
    const userId=req.params.userid;
    const password = req.body.password;

    // Call the deleteUser function
    const result = await settingsModel.deleteUser(userId, password);

    // Respond with a success message
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error('Error in deleteUser controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



exports.updateUserDetails2 = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.params.userid;

    // Cloudinary configuration
    cloudinary.config({
      cloud_name: 'dklbnjxn5',
      api_key: '755691416599864',
      api_secret: 'YR4UwBxD-3WBJemG4a3TYslaM1Y',
    });

    // Ensure cloudinary is defined
    if (!file || !file.buffer) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.buffer, {
      folder: `ades_upload/userProfile/${userId}`, // Replace with your desired folder name
    });

    // Check if the file was successfully uploaded
    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('Failed to upload the file to Cloudinary');
    }

    const imageUrl = uploadResult.secure_url;

    // Update user details and save image URL to the database
    const { newUsername, newEmail, newPassword } = req.body;
    const updatedUser = await settingsModel.updateUserDetails(newUsername, newEmail, newPassword, userId, imageUrl);

    res.json({ secure_url: imageUrl, user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

