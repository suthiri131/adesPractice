const pool = require("../config/database");

module.exports.getAllPostsHome = async () => {
  console.log("in postsModel.js model ");
  try {
    sql = `SELECT p.postid, p.userid, p.title, p.description, p.save_count, 
      ARRAY_AGG(pi.image_url) AS images
FROM posts p
LEFT JOIN post_images pi ON p.postid = pi.post_id
GROUP BY p.postid, p.userid, p.title, p.description, p.save_count ORDER BY p.postid DESC;`;

    const allPosts = await pool.query(sql);
    console.log(allPosts.rows);
    return allPosts.rows;
  } catch (error) {
    console.log("error" + error);
  }
};
module.exports.getAllPlacesHome = async () => {
  console.log("in placesModel.js model ");
  try {
    const sql =
      "SELECT places.*,places_cat.cat_name FROM places  INNER JOIN places_cat ON places.cat_id = places_cat.cat_id";
    const allPlaces = await pool.query(sql);
    console.log(allPlaces.rows);
    return { rows: allPlaces.rows };
  } catch (error) {
    console.log("error" + error);
    throw error;
  }
};

module.exports.searchAndFilterPlaces = async (title, filter) => {
  try {
    // Customize the SQL query based on your requirements
    let sql = `
      SELECT *
      FROM places
      WHERE place_name ILIKE $1
    `;

    const params = [`%${title}%`];

    // Add cat_id conditionally if the filter is provided and not "none"
    if (filter && filter !== "0") {
      sql += ` AND cat_id = $2`;
      params.push(filter);
    }

    const results = await pool.query(sql, params);
    console.log("Done in homemodel");
    return results.rows;
  } catch (error) {
    console.error("Error searching and filtering places:", error);
    throw error;
  }
};

module.exports.getSlideshow = async () => {
  try {
    const sql = "SELECT place_image FROM places WHERE placeid IN (1, 2, 6)";
    const allImages = await pool.query(sql);
    console.log(allImages.rows);
    return { rows: allImages.rows };
  } catch (error) {
    console.log("error" + error);
    throw error;
  }
};

module.exports.getMostBooked = async () => {
  try {
    const sql = `
      SELECT b.placeid, SUM(b.numberofTickets) AS totalTickets
      FROM bookings b
      GROUP BY b.placeid
      ORDER BY totalTickets DESC
      LIMIT 6;
    `;

    const mostBooked = await pool.query(sql);

    // Extract placeids from the result
    const placeIds = mostBooked.rows.map((row) => row.placeid);

    // Make a new query to get details from the places table for each placeid
    const placesDetails = await Promise.all(
      placeIds.map(async (placeId) => {
        const placeDetailsQuery = `
        SELECT places.*,places_cat.cat_name FROM places  INNER JOIN places_cat ON places.cat_id = places_cat.cat_id
          WHERE placeid = $1;
        `;
        const placeDetails = await pool.query(placeDetailsQuery, [placeId]);
        return placeDetails.rows[0]; // Assuming there's only one row for each placeid
      })
    );

    return placesDetails;
  } catch (error) {
    console.error("Error fetching most booked places:", error);
    throw error;
  }
};

module.exports.getMostPopularPosts = async () => {
  try {
    // Fetch the most saved posts
    const mostSavedSql = `
      SELECT s.postid, COUNT(s.postid) AS save_count
      FROM savedpost s
      GROUP BY s.postid
      ORDER BY COUNT(s.postid) DESC
      LIMIT 6;
    `;
    const mostSaved = await pool.query(mostSavedSql);

    // Extract post ids from the result
    const postIds = mostSaved.rows.map((row) => row.postid);

    // Fetch post details for the most saved posts
    const postDetailsSql = `
      SELECT p.postid, p.userid, p.title, p.description
      FROM posts p
      WHERE p.postid IN (${postIds.join(",")})
      ORDER BY p.created_time DESC;
    `;
    const postDetailsResult = await pool.query(postDetailsSql);
    const posts = postDetailsResult.rows;

    // Fetch images for the most saved posts
    const imagesSql = `
      SELECT post_id as postid, image_url FROM post_images
      WHERE post_id IN (${postIds.join(",")});
    `;
    const imagesResult = await pool.query(imagesSql);
    const images = imagesResult.rows;

    // Organize posts with their images using JavaScript
    const allPosts = posts.map((post) => {
      const postImages = images
        .filter((image) => image.postid === post.postid)
        .map((image) => image.image_url);

      return {
        ...post,
        images: postImages,
      };
    });

    return allPosts;
  } catch (error) {
    console.error("Error fetching most saved posts:", error);
    throw error;
  }
};

module.exports.getRecommendedPlaces = async (userid) => {
  try {
    const recommendedsql = `
      SELECT p.*
      FROM places p
      JOIN user_preferences upref ON p.cat_id = upref.pref_cat
      WHERE upref.userid = $1
      ORDER BY p.rating DESC
      LIMIT 6
    `;

    const response = await pool.query(recommendedsql, [userid]);

    if (response.rows && Array.isArray(response.rows)) {
      return response.rows;
    } else {
      console.error("Invalid or missing data in the response.");
      throw new Error("Failed to fetch recommended places.");
    }
  } catch (error) {
    console.error("Error fetching recommended places:", error);
    throw error;
  }
};

module.exports.searchAndFilterPosts = async (title, filter) => {
  try {
    // Customize the SQL query based on your requirements
    let sql = `
      SELECT *
      FROM posts
      JOIN places ON posts.locationid = places.placeid
      WHERE posts.title ILIKE $1
    `;

    const params = [`%${title}%`];

    // Add cat_id conditionally if the filter is provided and not "none"
    if (filter && filter !== "none") {
      sql += ` AND places.cat_id = $2`;
      params.push(filter);
    }

    const results = await pool.query(sql, params);
    console.log("Done in homemodel");
    return results.rows;
  } catch (error) {
    console.error("Error searching and filtering posts:", error);
    throw error;
  }
};
