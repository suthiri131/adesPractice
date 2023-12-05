const verifyUserID = (req, res, next) => {
  const userIDFromToken = req.userid; // Assuming req.userid is set by verifyJWT middleware
  const userIDFromParams = req.params.userid;

  if (userIDFromToken !== userIDFromParams) {
    console.log("Error: User ID does not match");
    return res.status(401).json({ error: "Unauthorized" });
  }

  // If the user ID matches, proceed to the next middleware or route handler
  next();
};

module.exports = verifyUserID;
