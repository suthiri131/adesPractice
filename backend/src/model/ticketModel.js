const pool = require("../config/database");
// Function to get available tickets for a specific place and date
exports.getAvailableTickets = async (placeid) => {
    try {
      const query = `select tickets from places where placeid = $1;`;
  
      const result = await pool.query(query, [placeid]);
console.log("Result from getAvailableTickets:"+ result.rows[0].tickets);

      return result.rows[0].tickets;
    } catch (error) {
        console.log("errorr")
      console.error("Error fetching available tickets:", error);
      throw error;
    }
  };
  
  // Function to get booked tickets for a specific place and date
  exports.getBookedTickets = async (placeid, selectedDate) => {
    console.log("selectedDate"+selectedDate);
    try {
      const query = `SELECT COALESCE(SUM(numberoftickets), 0) AS total_tickets
      FROM bookings
      WHERE placeid = $1 AND datebooked = $2
      
      `;
  
      const resultBooked = await pool.query(query, [placeid, selectedDate]);

console.log("Result from getBookedTickets:"+resultBooked.rows[0].total_tickets);

      return resultBooked.rows[0].total_tickets;
    } catch (error) {
        console.log("erorr");
      console.error("Error fetching booked tickets:", error);
      throw error;
    }
  };


  

