const express = require("express");
const statisticsModel = require("../model/statisticsModel");

exports.getTotalTickets = async (req, res) => {
  try {
    const statistics = await statisticsModel.getTotalTickets();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMostBookingsPlace = async (req, res) => {
  try {
    const statistics = await statisticsModel.getMostBookingsPlace();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRevenuePerMonth = async (req, res) => {
  try {
    const statistics = await statisticsModel.getRevenuePerMonth();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRevenuePerCategory = async (req, res) => {
  try {
    const statistics = await statisticsModel.getRevenuePerCategory();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTotalMoney = async (req, res) => {
  try {
    const statistics = await statisticsModel.getTotalMoney();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMostTicketsPurchased = async (req, res) => {
  try {
    const statistics = await statisticsModel.getMostTicketsPurchased();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getMostMoneySpent
exports.getMostMoneySpent = async (req, res) => {
  try {
    const statistics = await statisticsModel.getMostMoneySpent();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getHighestRating
exports.getHighestRating = async (req, res) => {
  try {
    const statistics = await statisticsModel.getHighestRating();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getLowestRating
exports.getLowestRating = async (req, res) => {
  try {
    const statistics = await statisticsModel.getLowestRating();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getMostTicketsByCat
exports.getMostTicketsByCat = async (req, res) => {
  try {
    const statistics = await statisticsModel.getMostTicketsByCat();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getLeastTicketsByCat
exports.getLeastTicketsByCat = async (req, res) => {
  try {
    const statistics = await statisticsModel.getLeastTicketsByCat();
    console.log("Fetched statistics:", statistics);
    res.status(200).json({ statistics: statistics });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};