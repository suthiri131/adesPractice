const pool = require('../config/database');
const bcrypt = require('bcrypt');

// const updateUserDetails=async(username,email,password,userid)=>{

//   try {
//     console.log('In settings model...');
//     const result = await pool.query('UPDATE users SET username=$1,email=$2,password=$3 WHERE userid=$4', [
//       username,
//       email,
//       password,
//       userid
//     ]);

//     const updatedUser = result.rows[0];

//     if (updatedUser) {
//       console.log('User update success');
//       console.log(updatedUser);
//       return updatedUser;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error in updateUser model:', error);
//     throw error;
//   }
// }
const updateUserDetails = async (username, email, password, userid) => {
  let client = null;

  try {
    client = await pool.connect();

    await client.query('BEGIN');

  
    const updateResult = await client.query(
      'UPDATE users SET username=$1,email=$2,password=$3 WHERE userid=$4', [
              username,
              email,
              password,
              userid
            ]
    );

    const updatedUser = updateResult.rows[0];

    // if (!updatedUser) {
    //   throw new Error('User update failed');
    // }

    await client.query('COMMIT');

    if(updatedUser){
      console.log('User update success');
         console.log(updatedUser);
         }

    return updatedUser;
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Error in updateUserDetails model:', error.message);
console.error(error.stack);
throw error;

  
  } finally {
    if (client) {
      client.release();
    }
  }
};





const getPassword=async(userid)=>{
  try {
    console.log('Before database query');
    console.log(userid);
    const result = await pool.query('SELECT password FROM users WHERE userid = $1', [userid]);
    console.log('After database query');

    const password = result.rows[0];

    if (password) {
      

      console.log("success");
      console.log(password);


      return password;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error in getpassword model:', error);
    throw error;
  }
}
const getAllCat = async () => {
  try {
    const catQuery = 'SELECT * FROM places_cat';
    const categories = await pool.query(catQuery);

    // Now 'categories' contains the result of the query
    console.log('Categories:', categories);

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const deleteUser = async (userId, password) => {
  try {
    // Check if the provided password is correct before proceeding
    const user = await pool.query(`SELECT * FROM users WHERE userid = ${userId}`);
    
    if (!user.rows[0] || !bcrypt.compareSync(password, user.rows[0].password)) {
      // Reject the promise if the password is incorrect
      throw new Error('Invalid password');
    }
    // Sequentially delete data from different tables
    await Promise.all([
      pool.query(`DELETE FROM savedpost WHERE userid = ${userId}`),
      pool.query(`DELETE FROM bookings WHERE userid = ${userId}`),
      pool.query(`DELETE FROM comments WHERE userid = ${userId}`),
    ]);



    // Fetch post IDs associated with the user
    const postIdsResult = await pool.query('SELECT postid FROM posts WHERE userid = $1', [userId]);
    const postIds = postIdsResult.rows.map((row) => row.postid);
    
    // Ensure that postIds is an array
    if (!Array.isArray(postIds)) {
      throw new Error('Failed to fetch post IDs');
    }
    
    // Concurrently delete data from different tables
    await Promise.all([
      // Delete from post_images using the fetched post IDs
      ...(postIds.map(async (postId) => {
        await pool.query('DELETE FROM post_images WHERE postid = $1', [postId]);
      })),
      // Delete from posts
      pool.query('DELETE FROM posts WHERE userid = $1', [userId]),
      // Delete from replies
      pool.query('DELETE FROM replies WHERE userid = $1', [userId]),
      // Delete from users
      pool.query('DELETE FROM users WHERE userid = $1', [userId]),
    ]);
    // Return a success message
    return "User and associated data deleted successfully";
  } catch (error) {
    // Return an error message
    throw new Error(`Error deleting user: ${error.message}`);
  }
};


const updatePreferences = async (userId, preferences) => {
  try {
    // Fetch user to check if it exists
    const user = await pool.query('SELECT * FROM users WHERE userid = $1', [userId]);

    if (!user.rows[0]) {
      throw new Error('User not found');
    }

    // Sequentially delete existing preferences for the user
    await pool.query('DELETE FROM user_preferences WHERE userid = $1', [userId]);

    // Concurrently insert new preferences
    await Promise.all(
      preferences.map(async (catId) => {
        await pool.query('INSERT INTO user_preferences (userid, pref_cat) VALUES ($1, $2)', [userId, catId]);
      })
    );

    return 'Preferences updated successfully';
  } catch (error) {
    throw new Error(`Error updating preferences: ${error.message}`);
  }
};



module.exports = {

 getPassword,
 deleteUser,
 getAllCat,
 updatePreferences,
 updateUserDetails,

};
