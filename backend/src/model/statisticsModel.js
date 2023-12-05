const pool = require("../config/database");

module.exports.getTotalTickets = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT SUM(numberoftickets) from bookings;";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};


module.exports.getMostBookingsPlace = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT p.place_name from places p, bookings b WHERE p.placeid = b.placeid GROUP BY b.placeid, p.place_name ORDER BY SUM(b.numberoftickets) DESC LIMIT 1;";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getRevenuePerMonth = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = `
        SELECT EXTRACT(YEAR FROM paymentdate) AS year, 
        EXTRACT(MONTH FROM paymentdate) AS month, 
        SUM(amountpaid) 
        FROM payments 
        GROUP BY EXTRACT(YEAR FROM paymentdate), EXTRACT(MONTH FROM paymentdate) 
        ORDER BY EXTRACT(MONTH FROM paymentdate);
        `;
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getRevenuePerCategory = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = `
        SELECT 
        pc.cat_id,
        pc.cat_name,
        COALESCE(SUM(p.amountpaid), 0) AS total_amount
    FROM 
        places_cat pc
        LEFT JOIN places pl ON pc.cat_id = pl.cat_id
        LEFT JOIN bookings b ON pl.placeid = b.placeid
        LEFT JOIN payments p ON b.bookingid = p.bookingid
    GROUP BY 
        pc.cat_id, pc.cat_name;    
        `;
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getTotalMoney = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT SUM(amountpaid) from payments;";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getMostTicketsPurchased = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT u.username, SUM(b.numberoftickets) AS total_tickets_purchased FROM users u JOIN bookings b ON u.userid = b.userid GROUP BY u.userid, u.username ORDER BY total_tickets_purchased DESC LIMIT 1;";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getMostMoneySpent = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT u.username, SUM(p.amountpaid) AS total_amount_spent FROM users u JOIN bookings b ON u.userid = b.userid JOIN payments p ON b.bookingid = p.bookingid GROUP BY u.userid, u.username ORDER BY total_amount_spent DESC LIMIT 1;";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getHighestRating = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT place_name, rating FROM places ORDER BY rating DESC LIMIT 1;";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getLowestRating = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT place_name, rating FROM places ORDER BY rating ASC LIMIT 1;";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getMostTicketsByCat = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT pc.cat_name, SUM(b.numberoftickets) AS total_tickets_purchased FROM places p JOIN bookings b ON p.placeid = b.placeid JOIN places_cat pc ON p.cat_id = pc.cat_id GROUP BY pc.cat_id, pc.cat_name ORDER BY total_tickets_purchased DESC LIMIT 1; ";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

module.exports.getLeastTicketsByCat = async () => {
    console.log('in statisticsModel.js model ');
    try {
        const sql = "SELECT pc.cat_name, SUM(b.numberoftickets) AS total_tickets_purchased FROM places p JOIN bookings b ON p.placeid = b.placeid JOIN places_cat pc ON p.cat_id = pc.cat_id GROUP BY pc.cat_id, pc.cat_name ORDER BY total_tickets_purchased ASC LIMIT 1;";
        const statistics = await pool.query(sql);
        console.log('statistics', statistics)
        return { rows: statistics.rows[0] };
    } catch (error) {
        console.log('error' + error);
        throw error;
    }
};

