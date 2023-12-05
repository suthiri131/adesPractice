const home = require("../model/homeModel");

exports.getAllPostsHome = async (req, res, next) => {
  console.log("In home controller");
  try {
    // Call the model function to get all users
    const allPosts = await home.getAllPostsHome();
    // Send the response to the client
    res.status(200).json({ posts: allPosts });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllPlacesHome = async (req, res) => {
  try {
    console.log("Fetching places...");
    const allPlacesHome = await home.getAllPlacesHome();
    console.log("Fetched places:", allPlacesHome);
    res.status(200).json({ places: allPlacesHome });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getSlideshow=async(req,res)=>{
  try{
    console.log("Fetching images...");
    const allImages=await home.getSlideshow();
    res.status(200).json({images: allImages});
  }
  catch(error){
    console.log("Error:"+error);
    res.status(500).json({error:"Internal Server Error"});

  }
}
exports.getMostBooked=async(req,res)=>{
  try{
    console.log("Fetching images...");
    const mostBookedDetails=await home.getMostBooked();
    res.status(200).json({mostBooked: mostBookedDetails});
  }
  catch(error){
    console.log("Error:"+error);
    res.status(500).json({error:"Internal Server Error"});

  }
}
exports.getMostSavedPosts=async(req,res)=>{
  try{
    console.log("Fetching most saved...");
    const mostSavedPosts=await home.getMostPopularPosts();
    res.status(200).json({mostSavedPosts:mostSavedPosts});

  }
  catch(error){
    console.log("error:"+error);
    res.status(500).json({error:"Internal Server Error"});
  }
}

exports.getRecommendedPlaces = async (req, res) => {
  try {
    const userId = req.params.userid; 
    const recommendedPlaces = await home.getRecommendedPlaces(userId);

    res.status(200).json({
      success: true,
      recommendedPlaces,
    });
  } catch (error) {
    console.error('Error getting recommended places:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommended places',
    });
  }
};
exports.searchAndFilter = async (req, res) => {
  try {
    const { title, filter } = req.body;

    // Use Promise.all to execute both search and filter operations concurrently
    const [placesResults] = await Promise.all([
      home.searchAndFilterPlaces(title, filter),
     
    ]);
    console.log("back in controller");
    if (placesResults.length === 0) {
      console.log("No places found");
    }
    
   
    // Return the combined results

    console.log(placesResults);
    
    res.status(200).json({ places: placesResults});
  } catch (error) {
    console.error("Error searching and filtering:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
