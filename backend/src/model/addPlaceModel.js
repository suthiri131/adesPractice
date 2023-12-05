const pool = require("../config/database");

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
    // Use parameterized query to prevent SQL injection
    const insertSql =
    `
    INSERT INTO places(place_name, price, latitude, longitude, description, rating, cat_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `;

    const values = [place_name, price, latitude, longitude, description, rating, cat_id];

    const result = await pool.query(insertSql, values);
    console.log('Successfully created new place:', result.rows[0]);
    
  } catch (error) {
    console.error('Error creating new place:', err);
  }
};