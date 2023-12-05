const pool = require("../config/database");

module.exports.getAllPosts = async () => {
  console.log("in postsModel.js model ");

  try {
    // Fetch posts
    const postsSql = `
      SELECT postid, userid, title, description FROM posts ORDER BY created_time DESC;`;

    const postsResult = await pool.query(postsSql);
    const posts = postsResult.rows;

    // Fetch images
    const imagesSql = `
      SELECT post_id as postid, image_url FROM post_images;`;

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

    console.log(allPosts);
    return allPosts;
  } catch (error) {
    console.error("Error fetching all posts:", error);

    throw error;
  }
};
//CREATE: insert posts
module.exports.uploadPost = async (userId, locationId, title, description) => {
  console.log("in ProfileModel");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // Use parameterized query to prevent SQL injection
    const insertSql =
      "INSERT INTO posts(userid, title, description,locationid, created_time) VALUES ($1, $2, $3, $4, NOW()) RETURNING postid;";

    const values = [userId, locationId, title, description];

    const result = await client.query(insertSql, values);
    // console.log('Final result:', JSON.stringify(result));
    console.log("id " + result.rows[0].postid);
    await client.query("COMMIT");
    return result.rows[0].postid;
  } catch (error) {
    console.error("Error uploading post:", error);
    await client.query("ROLLBACK");
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};
//CREATE: insert images of that posts
module.exports.uploadImage = async (postId, imageURL) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("in upload image");
    const result = await pool.query(
      `INSERT INTO post_images(post_id, image_url) VALUES($1, $2)`,
      [postId, imageURL]
    );
    await client.query("COMMIT");
    return result.rowCount;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error uploading images:", error);
  }
};

module.exports.editPost = async (title, description, locationId, postid) => {
  console.log("update post model");
  try {
    // Use parameterized query to prevent SQL injection
    const updateSql =
      "UPDATE posts SET title=$1, description=$2, locationid=$3, updated_time=NOW() WHERE postid=$4";

    const values = [title, description, locationId, postid];

    const result = await pool.query(updateSql, values);
    // console.log('Final result:', JSON.stringify(result));
    console.log("updated count from profile " + result.rowCount);
    return result.rowCount;
  } catch (error) {
    console.error("Error uploading post:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};
module.exports.updateImage = async (imageURL, postId) => {
  try {
    console.log("in update image");
    const result = await pool.query(
      `UPDATE post_images SET image_url=$1 WHERE post_id=$2`,
      [imageURL, postId]
    );
    return result.rowCount;
  } catch (error) {
    console.error("Error uploading images:", error);
  }
};

module.exports.deleteAllImagesForPost = async (postId) => {
  try {
    console.log("in delete all image");
    const result = await pool.query(
      `DELETE FROM post_images WHERE post_id=$1`,
      [postId]
    );
    return result.rowCount;
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};
module.exports.deletePost = async (postId) => {
  const client = await pool.connect();

  try {
    // Begin a transaction
    await client.query("BEGIN");

    // Get comment IDs associated with the post
    const commentIdsResult = await pool.query(
      `SELECT commentid FROM comments WHERE postid=$1`,
      [postId]
    );
    const commentIds = commentIdsResult.rows.map((row) => row.commentid);

    // Delete from replies using comment IDs
    await pool.query(`DELETE FROM replies WHERE commentid = ANY($1)`, [
      commentIds,
    ]);

    // Delete from comments
    await pool.query(`DELETE FROM comments WHERE postid=$1`, [postId]);

    // Delete from savedpost
    await pool.query(`DELETE FROM savedpost WHERE postid=$1`, [postId]);

    // Delete from post_images
    await pool.query(`DELETE FROM post_images WHERE post_id=$1`, [postId]);

    // Delete from posts
    const result = await pool.query(`DELETE FROM posts WHERE postid=$1`, [
      postId,
    ]);

    // Commit the transaction
    await client.query("COMMIT");

    // Return the number of deleted rows from the posts table
    return result.rowCount;
  } catch (error) {
    // If an error occurs, rollback the transaction
    await client.query("ROLLBACK");
    console.error("Error deleting post and related records:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

module.exports.deleteImage = async (postId, imageUrl) => {
  try {
    console.log("in delete image");
    const result = await pool.query(
      `DELETE FROM post_images WHERE post_id=$1 AND image_url=$2`,
      [postId, imageUrl]
    );
    return result.rowCount;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};

module.exports.getPostByUser = async (userId) => {
  try {
    // Query to get posts by user
    const postsQuery = `
      SELECT postid, userid, title, description FROM posts WHERE userid = $1
      ORDER BY postid DESC;`;

    const postsResult = await pool.query(postsQuery, [userId]);
    const posts = postsResult.rows; //retreivng the post details

    // Query to get post images
    //include rows where post_id is present in posts Array
    const imagesQuery = `
      SELECT post_id, image_url FROM post_images
      WHERE post_id IN (${posts.map((post) => post.postid).join(",")}) 
      ORDER BY post_id, image_id;`;

    const imagesResult = await pool.query(imagesQuery);
    const images = imagesResult.rows;

    // Map images to posts (filters images posted in the specific postid)
    const postsWithImages = posts.map((post) => {
      const postImages = images
        .filter((image) => image.post_id === post.postid)
        .map((image) => image.image_url); //creates array only with imageURL

      return {
        ...post,
        images: postImages,
      };
    });

    console.log(postsWithImages);
    return postsWithImages;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

module.exports.getUserByID = async (userid) => {
  console.log("in getUserByIDmodel ");
  try {
    sql = "SELECT * FROM users where userid=$1";
    const user = await pool.query(sql, [userid]);
    console.log(user.rows);
    return user.rows;
  } catch (error) {
    console.log("error" + error);
  }
};
module.exports.getPostByID = async (postID) => {
  console.log("in getPostByID model ");
  try {
    // Query to get post details
    const postQuery = `
      SELECT p.postid, p.userid, p.locationid, places.place_name, p.title, p.description, p.created_time, p.updated_time
      FROM posts p
      INNER JOIN places ON p.locationid = places.placeid
      WHERE p.postid = $1;`;

    const postResult = await pool.query(postQuery, [postID]);
    const post = postResult.rows[0];

    // Query to get post images
    const imagesQuery = `
      SELECT image_url
      FROM post_images
      WHERE post_id = $1
      ORDER BY image_id;`;

    const imagesResult = await pool.query(imagesQuery, [postID]);
    const postImages = imagesResult.rows.map((image) => image.image_url);

    // Combine post details with images
    const postWithImages = {
      ...post,
      images: postImages, // Use postImages instead of undefined 'images'
    };

    console.log(postWithImages);
    return postWithImages;
  } catch (error) {
    console.error("Error: ", error);
    throw error; // Re-throw the error to handle it elsewhere
  }
};

module.exports.searchPosts = async (query, uid) => {
  console.log("in search");
  try {
    const title = query.title || "";
    const desc = query.description || "";
    var searchByUser = query.searchByUser;
    console.log(uid);
    // Use the provided uid or default to an empty string
    // Query to get post details
    let postSQL = `
      SELECT p.postid, p.userid, p.locationid, loc.place_name, p.title, p.description, p.created_time, p.updated_time
      FROM posts p
      JOIN places loc ON p.locationid = loc.placeid
      WHERE (LOWER(p.title) LIKE LOWER($1) OR LOWER(p.description) LIKE LOWER($2))
    `;

    if (searchByUser == "false") {
      searchByUser = false;
    }
    if (searchByUser) {
      postSQL += ` AND p.userid = $3`;
    }
    console.log("in model, searchByUser " + searchByUser);
    const values = searchByUser
      ? [`%${title}%`, `%${desc}%`, searchByUser]
      : [`%${title}%`, `%${desc}%`];

    const postResult = await pool.query(postSQL, values);
    const posts = postResult.rows;

    // Query to get post images
    const postIds = posts.map((post) => post.postid);
    const imagesSQL = `
      SELECT post_id, image_url
      FROM post_images
      WHERE post_id = ANY($1);
    `;

    const imagesResult = await pool.query(imagesSQL, [postIds]);
    const imagesByPostId = imagesResult.rows.reduce((acc, image) => {
      const postId = image.post_id;
      if (!acc[postId]) {
        acc[postId] = [];
      }
      acc[postId].push(image.image_url);
      return acc;
    }, {});

    // Combine post details with images
    const postsWithImages = posts.map((post) => ({
      ...post,
      images: imagesByPostId[post.postid] || [],
    }));

    console.log(postsWithImages);
    return postsWithImages;
  } catch (error) {
    console.log("error " + error);
    throw error; // Re-throw the error to handle it elsewhere
  }
};

module.exports.getImages = async (postID) => {
  try {
    const result = await pool.query(
      "SELECT image_url FROM post_images WHERE post_id = $1",
      [postID]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching post images:", error);
    throw error;
  }
};

//CREATE: add post as saved
module.exports.insertSavedPosts = async (uid, pid) => {
  try {
    const addSave =
      "Insert INTO savedpost(userid,postid,saved_time) VALUES($1,$2,NOW())";
    const result = await pool.query(addSave, [uid, pid]);
    return result.rowCount;
  } catch (error) {
    console.error("Error inserting post", error);
    throw error;
  }
};
module.exports.checkIfPostIsLikedByUser = async (uid) => {
  try {
    // Fetch liked posts IDs for the user
    const likedPostsQuery = `
      SELECT postid FROM savedpost
      WHERE userid = $1;
    `;

    const likedPostsResult = await pool.query(likedPostsQuery, [uid]);
    const likedPostIds = likedPostsResult.rows.map((row) => row.postid);

    // Fetch details of liked posts along with their images
    const likedPostsDetailsQuery = `
      SELECT p.postid, p.userid, p.title,  p.description, pi.image_url FROM posts p
      INNER JOIN post_images pi ON p.postid = pi.post_id WHERE p.postid = ANY($1)
      ORDER BY p.postid ASC;
    `;

    const likedPostsDetailsResult = await pool.query(likedPostsDetailsQuery, [
      likedPostIds,
    ]);

    // Organize the data as needed
    const likedPostsDetails = likedPostsDetailsResult.rows.reduce(
      (acc, post) => {
        const postId = post.postid;
        if (!acc[postId]) {
          acc[postId] = {
            postid: postId,
            userid: post.userid,
            title: post.title,
            description: post.description,
            images: [],
          };
        }
        acc[postId].images.push(post.image_url);
        return acc;
      },
      {}
    );

    const likedPosts = Object.values(likedPostsDetails);
    console.log(likedPosts + "from model like by user");
    return likedPosts;
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    throw error;
  }
};

module.exports.removeSavePost = async (uid, pid) => {
  try {
    const delSave = `DELETE FROM savedpost WHERE userid = $1 AND postid = $2;
    `;
    const result = await pool.query(delSave, [uid, pid]);
    return result.rowCount;
  } catch (error) {
    console.error("Error deleting liked posts:", error);
    throw error;
  }
};

module.exports.countSavePost = async (postID) => {
  try {
    const sql = `select count(*) AS savecount from savedpost where postid=$1`;
    const result = await pool.query(sql, [postID]);
    return result.rows;
  } catch (error) {
    console.error("Error counting posts:", error);
  }
};

module.exports.recommendedPostForPlaces = async (placeid) => {
  try {
    // Query to get posts
    const postsQuery = `
      SELECT postid, title, description, locationid
      FROM posts
      WHERE locationid = $1
      LIMIT 4
      ;
    `;

    // Query to get images
    const imagesQuery = `
      SELECT post_id, image_url
      FROM post_images
      WHERE post_id IN (
        SELECT postid
        FROM posts
        WHERE locationid = $1
      );
    `;

    // Execute both queries concurrently
    const [postsResult, imagesResult] = await Promise.all([
      pool.query(postsQuery, [placeid]),
      pool.query(imagesQuery, [placeid]),
    ]);

    // Process the results and join them based on the post_id
    const posts = postsResult.rows.map((post) => ({
      ...post,
      images: imagesResult.rows
        .filter((image) => image.post_id === post.postid)
        .map((image) => image.image_url),
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    throw error; // You might want to handle or log the error appropriately
  }
};
module.exports.getSimilarPosts = async (placeid, userid, postID) => {
  try {
    // Query to get posts and all associated images
    const postsQuery = `
      SELECT p.postid, p.title, p.description, p.locationid, p.userid, pi.image_url
      FROM posts p
      LEFT JOIN post_images pi ON p.postid = pi.post_id
      WHERE p.locationid = $1 AND p.postid <> ${postID}
      GROUP BY p.postid, pi.image_url
      LIMIT 8;
    `;

    // Execute the query
    const postsResult = await pool.query(postsQuery, [placeid]);

    // Process the results and organize them into a structured format
    const posts = postsResult.rows.reduce((acc, row) => {
      const existingPost = acc.find((post) => post.postid === row.postid);

      if (existingPost) {
        // If the post already exists, add the image URL to its list of images
        if (row.image_url) {
          existingPost.images.push(row.image_url);
        }
      } else {
        // If the post doesn't exist, create a new post object
        const newPost = {
          postid: row.postid,
          title: row.title,
          description: row.description,
          locationid: row.locationid,
          userid: row.userid,
          images: row.image_url ? [row.image_url] : [],
        };

        // Add the new post object to the accumulator
        acc.push(newPost);
      }

      return acc;
    }, []);

    // If the number of posts is less than 8, fetch additional posts for the same user
    if (posts.length < 8) {
      const additionalPostsQuery = `
        SELECT p.postid, p.title, p.description, p.locationid, p.userid, pi.image_url
        FROM posts p
        LEFT JOIN post_images pi ON p.postid = pi.post_id
        WHERE p.userid = $1 AND p.locationid != $2 AND p.postid <> ${postID}
        GROUP BY p.postid, pi.image_url
        LIMIT 8 - $3;
      `;

      const additionalPostsResult = await pool.query(additionalPostsQuery, [
        userid,
        placeid,
        posts.length,
      ]);

      const additionalPosts = additionalPostsResult.rows.reduce((acc, row) => {
        const existingPost = acc.find((post) => post.postid === row.postid);

        if (existingPost) {
          // If the post already exists, add the image URL to its list of images
          if (row.image_url) {
            existingPost.images.push(row.image_url);
          }
        } else {
          // If the post doesn't exist, create a new post object
          const newPost = {
            postid: row.postid,
            title: row.title,
            description: row.description,
            locationid: row.locationid,
            userid: row.userid,
            images: row.image_url ? [row.image_url] : [],
          };

          // Add the new post object to the accumulator
          acc.push(newPost);
        }

        return acc;
      }, []);

      posts.push(...additionalPosts);
    }

    return posts;
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    throw error; // You might want to handle or log the error appropriately
  }
};

//su
module.exports.getCommentsByPostID = async (postID) => {
  try {
    // Adjust this SQL query to fit your database schema for fetching comments
    const sql = ` 
    SELECT comments.commentid, comments.postid,comments.userid, 
    comments.content,users.username, comments.date_commented
    FROM comments
    JOIN users ON comments.userid = users.userid
    WHERE comments.postid = $1
    order by comments.date_commented desc
    ;
    `;
    const comments = await pool.query(sql, [postID]);
    return comments.rows;
  } catch (error) {
    console.log("Error: " + error);
    throw error; // Rethrow the error to handle it in the controller or service layer
  }
};

module.exports.addComment = async (postID, userID, content) => {
  try {
    const sql = `
      INSERT INTO comments (postid, userid, content, date_commented)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING commentid, postid, userid, content, date_commented;
    `;

    const values = [postID, userID, content];

    const newComment = await pool.query(sql, values);

    // Retrieve username based on the inserted userid
    const userQuery = `
      SELECT username
      FROM users
      WHERE userid = $1;
    `;

    const userValues = [userID];

    const userResult = await pool.query(userQuery, userValues);
    const username = userResult.rows[0].username;

    const finalComment = {
      ...newComment.rows[0],
      username,
    };

    return finalComment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

module.exports.deleteAllReplies = async (commentID) => {
  try {
    const result = await pool.query(
      `DELETE FROM replies WHERE commentid = $1`,
      [commentID]
    );
    return result.rowCount;
  } catch (error) {
    console.error("Error deleting replies:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};


module.exports.deleteComment = async (commentID) => {
  try {
    
    const result = await pool.query(
      `DELETE FROM comments WHERE commentid = $1`,
      [commentID]
    );
    return result.rowCount;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};

module.exports.updateComment = async (commentId, content) => {
  console.log("update comment model");
  try {
    // Use parameterized query to prevent SQL injection
    const updateSql =
      "UPDATE comments SET content = $1, date_commented = NOW() WHERE commentid = $2";
    const values = [content, commentId];

    const Commentresult = await pool.query(updateSql, values);

    if (Commentresult.rowCount > 0) {
      // Fetch the updated comment after the update operation
      const updatedComment = await pool.query(
        "SELECT content FROM comments WHERE commentid = $1",
        [commentId]
      );
      console.log(updatedComment.rows[0]);
      // Return the updated comment content
      return updatedComment.rows[0].content;
    } else {
      // No rows were affected by the update
      return null; // Or handle this scenario accordingly
    }

    //return Commentresult.rowCount;
  } catch (error) {
    console.error("Error uploading comment:", error);
    throw error;
  }
};

module.exports.addReply = async (commentid, postid, userid, content) => {
  try {
    const sql = `
    INSERT INTO replies (commentid, userid, content, date_replied  )
    VALUES ($1, $2,$3,NOW())
    RETURNING replyid, commentid, userid, content, date_replied;
    `;

    const values = [commentid, userid, content];

    const newReply = await pool.query(sql, values);

    // Retrieve username based on the inserted userid
    const userQuery = `
      SELECT username
      FROM users
      WHERE userid = $1;
    `;

    const userValues = [userid];

    const userResult = await pool.query(userQuery, userValues);
    const username = userResult.rows[0].username;

    const finalReply = {
      ...newReply.rows[0],
      username,
    };

    return finalReply;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

module.exports.getRepliesbyCommentID = async (commentID) => {
  try {
    // Adjust this SQL query to fit your database schema for fetching comments
    const sql = ` 
    SELECT r.replyid, r.userid, 
    r.content,u.username, r.date_replied
    FROM replies r
    JOIN users u ON r.userid = u.userid
    WHERE r.commentid = $1
    order by r.date_replied desc
    ;
    `;
    const replies = await pool.query(sql, [commentID]);
    return replies.rows;
  } catch (error) {
    console.log("Error: " + error);
    throw error; // Rethrow the error to handle it in the controller or service layer
  }
};



