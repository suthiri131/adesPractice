module.exports.getPostByUser = async (userId) => {
    try {
      const sql = `
        SELECT p.postid, p.userid, p.title, p.description, p.save_count, 
               ARRAY_AGG(pi.image_url) AS images
        FROM posts p
        LEFT JOIN post_images pi ON p.postid = pi.post_id
        WHERE p.userid = $1
        GROUP BY p.postid, p.userid, p.title, p.description, p.save_count ORDER BY p.postid DESC;
      `;
      const allPosts = await pool.query(sql, [userId]);
      console.log(allPosts.rows);
      return allPosts.rows;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  };