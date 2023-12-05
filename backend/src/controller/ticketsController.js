const ticketModel = require("../model/ticketModel");
exports.getAvailableTickets = async (req, res, next) => {
  console.log("In getAvailableTickets controller");
  try {
    const { placeid, selectedDate } = req.params;
    console.log(selectedDate);
    const [availableTickets, bookedTickets] = await Promise.all([
      ticketModel.getAvailableTickets(placeid),
      ticketModel.getBookedTickets(placeid, selectedDate),
    ]);

    // Calculate the difference between available and booked tickets
    const remainingTickets = availableTickets - bookedTickets;

    res.status(200).json({ remainingTickets });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.insertPurchaseTicket = async (req, res, next) => {
  const purchaseTicket = req.params.purchaseTicket;
  try {
    // Call the model function to get replies by commentID
    const replies = await ticketModel.insertPurchaseTicket(purchaseTicket);
    // Send the response to the client
    res.status(200).json({ replies: replies });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

