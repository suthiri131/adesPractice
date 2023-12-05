const user= require('../model/testModel')

exports.getAllUser = async (req, res, next) => {
    console.log('In controller');
    try {
        // Call the model function to get all users
        const allUsers = await user.getAllUser();
        // Send the response to the client
        res.status(200).json({ users: allUsers });
    } catch (error) {
        console.log('Error: ' + error);
        // Handle the error and send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }}