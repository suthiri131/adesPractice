const express = require("express");
const place = require("../model/placesModel");

exports.getAllPlaces = async (req, res) => {
  try {
    console.log("Fetching places...");
    const allPlaces = await place.getAllPlaces();
    //console.log("Fetched places:", allPlaces);
    res.status(200).json({ places: allPlaces });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.createPlace = async (req, res) => {
//     try {
//        const newPlace = new Place(req.body.category, req.body.place_name, req.body.price, req.body.latitude, req.body.longitude, req.body.description, req.body.rating, req.body.cat_id);
//        const result = await placesModel.addPlace(newPlace.place_name, newPlace.price, newPlace.latitude, newPlace.longitude, newPlace.description, newPlace.rating, newPlace.cat_id);
//        console.log('Successfully created new place:', result.rows[0]);
//        res.status(201).json({
//          status: "success",
//          data: {
//            place: result.rows[0],
//          },
//        });
//     } catch (err) {
//        console.error('Error creating new place:', err);
//        res.status(500).json({
//          status: "error",
//          message: "Server error",
//        });
//     }
// };

exports.createPlace = async (req, res) => {
  try {
    const newPlace = {
      place_name: req.body.place_name,
      price: req.body.price,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      description: req.body.description,
      rating: req.body.rating,
      cat_id: req.body.cat_id,
    };

    const result = await place.addPlace(
      newPlace.place_name,
      newPlace.price,
      newPlace.latitude,
      newPlace.longitude,
      newPlace.description,
      newPlace.rating,
      newPlace.cat_id
    );

    console.log("Successfully created new place:", result);

    res.status(201).json({
      status: "success",
      data: {
        place: result,
        message: "Place added successfully."
      },
    });
  } catch (err) {
    console.error("Error creating new place:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};


exports.updatePlace = async (req, res) => {
  try {
    const placeid = req.params.placeid;

    console.log('placeid', placeid)

    const updatedPlace = {
      place_name: req.body.place_name,
      price: req.body.price,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      description: req.body.description,
      rating: req.body.rating,
      cat_id: req.body.cat_id,
    };

    const result = await place.updatePlace(
      placeid,
      updatedPlace.place_name,
      updatedPlace.price,
      updatedPlace.latitude,
      updatedPlace.longitude,
      updatedPlace.description,
      updatedPlace.rating,
      updatedPlace.cat_id
    );

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Place not found",
      });
    }

    console.log("Successfully updated place:", result);

    res.status(200).json({
      status: "success",
      data: {
        place: result,
        message: "Place updated successfully.",
      },
    });
  } catch (err) {
    console.error("Error updating place:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

exports.deletePlace = async (req, res) => {
  console.log('deleting in controller')
  try {
    const placeid = req.params.placeid;

    const result = await place.deletePlace(placeid);

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Place not found",
      });
    }

    console.log("Successfully deleted place:", result);

    res.status(200).json({
      status: "success",
      data: {
        place: result,
        message: "Place deleted successfully.",
      },
    });
  } catch (err) {
    console.error("Error deleting place:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesModel();
    res.status(200).json({
      status: 'success',
      data: {
        categories:categories,
        message: 'Categories fetched successfully.',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

exports.getPlaceByID = async (req, res, next) => {
  console.log("In controller");
  // let placeid = req.params.placeid;
  let placeid = req.params.placeid;
  console.log('placeid: ', placeid)
  try {
    // Call the model function to get all users
    const post = await place.getPlaceByID(placeid);
    console.log('post', post)
    // Send the response to the client
    res.status(200).json({ post });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAdminSearch = async (req, res, next) => {
  console.log("In controller");
  let place_name = req.query.place_name + "%";
  console.log('place_name', place_name)
  try {
    // Call the model function to get all users
    const places = await place.getAdminSearch(place_name);
    // console.log('post', post)
    // Send the response to the client
    res.status(200).json({ places });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};