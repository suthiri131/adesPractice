import React, { useState, useEffect } from 'react';
import RevenueChart from '../../components/Admin/RevenueChart.js';
import RevenueByCategoryChart from '../../components/Admin/RevenueByCategory.js';

const AdminStats = () => {
  const [totalTickets, setTotalTickets] = useState(0);
  const [mostBookings, setMostBookings] = useState('');
  const [totalMoney, setTotalMoney] = useState(0);
  const [mostAmountOfTickets, setMostAmountOfTickets] = useState([]);
  const [mostAmountOfTicketsName, setMostAmountOfTicketsName] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch total tickets
        const totalTicketsResponse = await fetch('/api/admin/stats/totaltickets');
        if (!totalTicketsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const totalTicketsData = await totalTicketsResponse.json();
        setTotalTickets(totalTicketsData.statistics.rows.sum);

        // Fetch most bookings
        const mostBookingsResponse = await fetch('/api/admin/stats/mostbookings');
        if (!mostBookingsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const mostBookingsData = await mostBookingsResponse.json();
        setMostBookings(mostBookingsData.statistics.rows.place_name);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }

      // Fetch total amount of money collected
      const totalMoneyResponse = await fetch('/api/admin/stats/totalmoney');
      if (!totalMoneyResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const totalMoneyData = await totalMoneyResponse.json();
      setTotalMoney(totalMoneyData.statistics.rows.sum);

      // Fetch customer that purchased the most tickets
      const mostAmountOfTicketsResponse = await fetch('/api/admin/stats/mostticketspurchased');
      if (!mostAmountOfTicketsResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const mostAmountOfTicketsData = await mostAmountOfTicketsResponse.json();
      setMostAmountOfTickets(mostAmountOfTicketsData.statistics.rows.total_tickets_purchased);
      setMostAmountOfTicketsName(mostAmountOfTicketsData.statistics.rows.username);
    };

    fetchStatistics();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Statistics</h2>

      <div className="row">
        <div className="col-md-6 mb-4 col-6">
          <div className="card faint-border rounded">
            <div className="card-body">
              <h5 className="card-title">Total Number of Tickets Sold</h5>
              <p className="card-text">{totalTickets}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4 col-6">
          <div className="card faint-border rounded">
            <div className="card-body">
              <h5 className="card-title">Place with the Most Tickets Sold</h5>
              <p className="card-text">{mostBookings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card faint-border rounded">
            <div className="card-body">
              <h5 className="card-title">Total Amount of Money Made All-Time</h5>
              <p className="card-text">{totalMoney}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card faint-border rounded">
            <div className="card-body">
              <h5 className="card-title">Customer That Spent the Most</h5>
              <p className="card-text">
                {mostAmountOfTickets} by {mostAmountOfTicketsName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card faint-border rounded">
            <div className="card-body">
              <h5 className="card-title">Revenue Charts</h5>
              <RevenueChart />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card faint-border rounded">
            <div className="card-body">
              <h5 className="card-title">Revenue by Category Charts</h5>
              <RevenueByCategoryChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
