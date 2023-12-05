import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditProfileAdmin from './EditProfileAdmin.js';
import AddPlaceForm from './AddPlaceForm';
import ViewAllPlaces from './viewAllPlaces';
import AdminStats from './AdminStats';
import { Col, Container, Row, Nav } from 'react-bootstrap';

const AdminHome = () => {
  const [selectedTab, setSelectedTab] = useState('adminStats');
  const [places, setPlaces] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [mostBookings, setMostBookings] = useState('');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('/api/allPlaces');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data.places.rows);
        const placeData = data.places.rows;
        setPlaces(placeData);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    const fetchStatistics = async () => {
      try {
        const totalTicketsResponse = await fetch('/api/admin/stats/totaltickets');
        if (!totalTicketsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const totalTicketsData = await totalTicketsResponse.json();
        setTotalTickets(totalTicketsData.statistics.rows.sum);

        const mostBookingsResponse = await fetch('/api/admin/stats/mostbookings');
        if (!mostBookingsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const mostBookingsData = await mostBookingsResponse.json();
        setMostBookings(mostBookingsData.statistics.rows.place_name);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchPlaces();
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (Array.isArray(places)) {
      console.log('Places state updated:', places);
    }
  }, [places]);

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col md={3} className="bg-dark text-white sidebar">
          <div className="adminhome-title">
            <h1>Admin Home</h1>
          </div>

          <Nav className="flex-column custom-nav">
            <Nav.Item>
              <Nav.Link
                className={`nav-link ${selectedTab === 'adminStats' ? 'active' : ''}`}
                onClick={() => handleTabClick('adminStats')}
              >
                Admin Stats
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                className={`nav-link ${selectedTab === 'viewallplaces' ? 'active' : ''}`}
                onClick={() => handleTabClick('viewallplaces')}
              >
                View All Places
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                className={`nav-link ${selectedTab === 'addPlace' ? 'active' : ''}`}
                onClick={() => handleTabClick('addPlace')}
              >
                Add Place
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                className={`nav-link ${selectedTab === 'editProfileAdmin' ? 'active' : ''}`}
                onClick={() => handleTabClick('editProfileAdmin')}
              >
                Edit Profile
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        <Col md={9} className="main-content">
          {selectedTab === 'viewallplaces' && <ViewAllPlaces />}
          {selectedTab === 'editProfileAdmin' && <EditProfileAdmin />}
          {selectedTab === 'addPlace' && <AddPlaceForm />}
          {selectedTab === 'adminStats' && <AdminStats />}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;
