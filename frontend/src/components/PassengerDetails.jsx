import React from 'react';
import { useParams } from 'react-router-dom'; // Hook to get the params from the URL
import '../styles/passengerDetails.css'; // Import the CSS file

const PassengerDetails = () => {
  const { id } = useParams(); // Get the passenger ID from the URL

  // Dummy data to simulate a fetch request
  const passengerData = {
    1: { firstName: 'Jon', lastName: 'Snow', email: 'someone@gmail.com', phoneNumber: '+1234567890', gender: 'Female', totalRides: 2, completedRides: 2, cancelledRides: 0, ratings: 3.5 },
    2: { firstName: 'Cersei', lastName: 'Lannister', email: 'someone2@gmail.com', phoneNumber: '+1234364890', gender: 'Male', totalRides: 2, completedRides: 1, cancelledRides: 1, ratings: 5 },
    // Add more passenger data here
  };

  const passenger = passengerData[id]; // Get the passenger data based on the ID from the URL

  if (!passenger) {
    return <div className="not-found">Passenger not found</div>;
  }

  return (
    <div className="passenger-details-container">
      <h2 className="header">Passenger Details</h2>
      <div className="passenger-info">
        <p><strong>Full Name:</strong> {passenger.firstName} {passenger.lastName}</p>
        <p><strong>Email:</strong> {passenger.email}</p>
        <p><strong>Phone Number:</strong> {passenger.phoneNumber}</p>
        <p><strong>Gender:</strong> {passenger.gender}</p>
        <p><strong>Total Rides:</strong> {passenger.totalRides}</p>
        <p><strong>Completed Rides:</strong> {passenger.completedRides}</p>
        <p><strong>Cancelled Rides:</strong> {passenger.cancelledRides}</p>
        <p><strong>Ratings:</strong> {passenger.ratings}</p>
      </div>
    </div>
  );
};

export default PassengerDetails;
