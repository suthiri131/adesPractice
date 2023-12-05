const post= require('../model/postsModel')

const getAllPosts = async (req, res, next) => {
    console.log('In post controller');
    try {
        // Call the model function to get all users
        const allPosts = await post.getAllPosts()
        // Send the response to the client
        res.status(200).json({ posts: allPosts });
    } catch (error) {
        console.log('Error: ' + error);
        // Handle the error and send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }}

    module.exports={
        getAllPosts,
    }