const pool = require("../config/database");

module.exports.getAllPlacesHome = async () => {
  console.log('in placesModel.js model ');
  try {
    const sql = "SELECT places.*,places_cat.cat_name FROM places  INNER JOIN places_cat ON places.cat_id = places_cat.cat_id";
    const allPlaces = await pool.query(sql);
    console.log(allPlaces.rows);
    return { rows: allPlaces.rows };
  } catch (error) {
    console.log('error' + error);
    throw error;
  }
};

module.exports.getAllPlaces = async () => {
  console.log('in placesModel.js model ');
  try {
    const sql = "SELECT * FROM places";
    const allPlaces = await pool.query(sql);
    console.log(allPlaces.rows);
    return { rows: allPlaces.rows };
  } catch (error) {
    console.log('error' + error);
    throw error;
  }
};

// module.exports.getAllPlaces = async () => {
//   console.log("in placesModel.js model ");
//   try {
//     const sql = "SELECT place_id, place_name FROM places";
//     const result = await pool.query(sql);

//     console.log(allPlaces);
//     return allPlaces;
//   } catch (error) {
//     console.log("error" + error);
//     throw error;
//   }
// };

module.exports.addPlace = async (
  place_name,
  price,
  latitude,
  longitude,
  description,
  rating,
  cat_id
) => {
  console.log("in addPlaceModel");
  try {
    const insertSql = `
      INSERT INTO places(place_name, price, latitude, longitude, description, rating, cat_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `;

    const values = [
      place_name,
      price,
      latitude,
      longitude,
      description,
      rating,
      cat_id,
    ];

    const result = await pool.query(insertSql, values);
    console.log("Successfully created new place:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating new place:", error);
  }
};


module.exports.updatePlace = async (
  placeid,
  place_name,
  price,
  latitude,
  longitude,
  description,
  rating,
  cat_id
) => {
  console.log("in updatePlaceModel");
  try {
    const updateSql = `
      UPDATE places
      SET place_name = $2, 
          price = $3, 
          latitude = $4, 
          longitude = $5, 
          description = $6, 
          rating = $7, 
          cat_id = $8
      WHERE placeid = $1
      RETURNING *
    `;

    const values = [
      placeid,
      place_name,
      price,
      latitude,
      longitude,
      description,
      rating,
      cat_id,
    ];

    const result = await pool.query(updateSql, values);
    console.log('result: ', result.rowCount)
    // console.log("Successfully updated place:", result.rows[0]);
    return result.rowCount;
  } catch (error) {
    console.error("Error updating place:", error);
  }
};

module.exports.deletePlace = async (placeid) => {
  console.log("in deletePlaceModel");
  const client = await pool.connect();
  try {
    // const deleteRepliesSql = `
    //   DELETE FROM replies r, comments c, posts p, places pl WHERE r.commentid = c.commentid AND c.postid = p.postid AND p.locationid = pl.placeid AND placeid = $1
    // `
    // const deleteCommentsSql = `
    //   DELETE FROM comments c, posts p, places pl WHERE c.postid = p.postid AND p.locationid = pl.placeid AND placeid = $1
    // `
    // const deletePostImagesSql = `
    //   DELETE FROM post_images pi, posts p, places pl WHERE pi.post_id = p.postid AND p.locationid = pl.placeid AND placeid = $1
    // `
    // const deletePostsSql = `
    //   DELETE FROM posts p, places pl WHERE p.locationid = pl.placeid AND placeid = $1
    // `
    // const deleteRatingsSql = `
    // DELETE FROM ratings r, places pl WHERE r.placeid = pl.placeid AND placeid = $1
    // `
    // const deleteSql = `
    //   DELETE FROM places
    //   WHERE placeid = $1
    //   RETURNING *
    // `;

    const getBookingsSql = `
    SELECT * from bookings WHERE placeid = $1;
    `

    const deleteRepliesSql = `
  DELETE FROM replies r USING comments c, posts p, places pl
  WHERE r.commentid = c.commentid AND c.postid = p.postid AND p.locationid = p.locationid AND p.locationid = $1;
`;

    const deleteCommentsSql = `
  DELETE FROM comments c USING posts p, places pl
  WHERE c.postid = p.postid AND p.locationid = p.locationid AND p.locationid = $1;
`;

    const deletePostImagesSql = `
  DELETE FROM post_images pi USING posts p, places pl
  WHERE pi.post_id = p.postid AND p.locationid = $1;
`;

    const deleteSavePostsSql = `
DELETE FROM savedpost sp USING posts p, places pl
WHERE sp.postid = p.postid AND p.locationid = $1;
`

    const deletePostsSql = `
  DELETE FROM posts p USING places pl
  WHERE p.locationid = p.locationid AND p.locationid = $1;
`;

    const deleteRatingsSql = `
  DELETE FROM ratings r USING places pl
  WHERE r.placeid = pl.placeid AND pl.placeid = $1;
`;

    const deleteSql = `
      DELETE FROM places
      WHERE placeid = $1
      RETURNING *
    `;

    const values = [placeid];

    //   const result = await pool.query(deleteSql, values);

    //   if (result.rows.length === 0) {
    //     console.log("Place not found for deletion");
    //     return null;
    //   }

    //   console.log("Successfully deleted place:", result.rows[0]);
    //   return result.rows[0];
    // } catch (error) {
    //   console.error("Error deleting place:", error);
    // }

    const check = await client.query(getBookingsSql, values);
    if (check.rows.length > 0) {
      console.log("The place has bookings");
      return null;
    }

    await client.query(deleteRepliesSql, values);
    await client.query(deleteCommentsSql, values);
    await client.query(deletePostImagesSql, values);
    await client.query(deleteSavePostsSql, values);
    await client.query(deletePostsSql, values);
    await client.query(deleteRatingsSql, values);

    const result = await client.query(deleteSql, values);

    if (result.rows.length === 0) {
      console.log("Place not found for deletion");
      return null;
    }

    console.log("Successfully deleted place:", result.rows[0]);

    await client.query('COMMIT');

    return result.rows[0];
  } catch (error) {
    console.error("Error deleting place:", error);

    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
};

module.exports.getCategories = async () => {
  try {
    const result = await pool.query('SELECT cat_id, cat_name FROM places_cat');
    console.log("Successfully fetched categories:", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

module.exports.getPlaceByID = async (placeid) => {
  console.log("in getPlaceID model ");
  try {
    sql = `SELECT places.*, places_cat.cat_name 
    FROM places  
    INNER JOIN places_cat ON places.cat_id = places_cat.cat_id
    WHERE places.placeid = $1
    GROUP BY places.placeid, places.place_name, places.price, places.latitude, places.longitude, places.description, places.rating, places_cat.cat_name
    ORDER BY places.placeid ASC`;
    const place = await pool.query(sql, [placeid]);
    // console.log(post.rows);
    console.log('this worked');
    // return place;
    // return { place.rows };
    return place.rows[0];

  } catch (error) {
    console.log("error " + error);
  }
};

module.exports.getAdminSearch = async (place_name) => {
  console.log("in getPlaceID model");
  try {
    sql = `SELECT places.*, places_cat.cat_name 
    FROM places  
    INNER JOIN places_cat ON places.cat_id = places_cat.cat_id
    WHERE places.place_name ILIKE $1
    GROUP BY places.placeid, places.place_name, places.price, places.latitude, places.longitude, places.description, places.rating, places_cat.cat_name
    ORDER BY places.placeid ASC`;
    const place = await pool.query(sql, [place_name]);
    console.log('place', place)
    console.log('this worked');
    return place.rows;
  } catch (error) {
    console.log("error " + error);
  }
};
