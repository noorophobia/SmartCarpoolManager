import React from 'react';
import { useParams } from 'react-router-dom'; // To access ride ID from URL params
import { Box, Grid, Card, CardContent, Typography, Divider } from '@mui/material';
import '../styles/rideDetails.css'; // Import the CSS file

const RideDetails = () => {
  const { rideID } = useParams(); // Get ride ID from the URL
 console.log(rideID);
  // Dummy data to simulate a fetch request
  const rideData = {
    RIDE123: {
      pickUpLocation: "Model Town",
      dropOffLocation: "Liberty Market",
      rideMode: "Carpool",
      rideStatus: "Ongoing",
      noOfPassengers: 3,
      paymentID: "PAY5678",
      amount: 150.0,
      paymentType: "Credit Card",
      paymentStatus: "Completed",
      passengers: [
        {
          passengerID: "1",
          name: "John Doe",
          age: 30,
          pickUpLocation: "Model Town",
          dropOffLocation: "Liberty Market",
          paymentType: "Credit Card",
          paymentStatus: "Completed",
        },
        {
          passengerID: "2",
          name: "Jane Smith",
          age: 28,
          pickUpLocation: "Model Town",
          dropOffLocation: "Gulberg",
          paymentType: "Debit Card",
          paymentStatus: "Pending",
        },
        {
          passengerID: "3",
          name: "Jim Brown",
          age: 35,
          pickUpLocation: "Liberty Market",
          dropOffLocation: "Faisal Town",
          paymentType: "Cash",
          paymentStatus: "Completed",
        },
      ],
    },
    RIDE124: {
      pickUpLocation: "DHA",
      dropOffLocation: "Gulberg",
      rideMode: "Single",
      rideStatus: "Cancelled",
      cancellationReason: "Driver unavailable",
      noOfPassengers: 1,
      paymentID: "PAY5679",
      amount: 500.0,
      paymentType: "Cash",
      paymentStatus: "Refunded",
      passengers: [
        {
          passengerID: "124",
          name: "Alice Green",
          age: 26,
          pickUpLocation: "DHA",
          dropOffLocation: "Gulberg",
          paymentType: "Cash",
          paymentStatus: "Refunded",
        },
      ],
    },
  };

  const ride = rideData[rideID]; // Get the ride data based on the rideID

  if (!ride) {
    return <div className="ride-details-container not-found">Ride not found</div>;
  }

  return (
    <div className="ride-details-container">
      <h2>Ride Details</h2>

      <table className="info-table">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="bold">Pick-Up Location</td>
            <td>{ride.pickUpLocation}</td>
          </tr>
          <tr>
            <td className="bold">Drop-Off Location</td>
            <td>{ride.dropOffLocation}</td>
          </tr>
          <tr>
            <td className="bold">Ride Mode</td>
            <td>{ride.rideMode}</td>
          </tr>
          <tr>
            <td className="bold">Ride Status</td>
            <td>{ride.rideStatus}</td>
          </tr>
          {/* Show Cancellation Reason if the Ride is Cancelled */}
          {ride.rideStatus === "Cancelled" && (
            <tr>
              <td className="bold">Cancellation Reason</td>
              <td>{ride.cancellationReason}</td>
            </tr>
          )}
          <tr>
            <td className="bold">No of Passengers</td>
            <td>{ride.noOfPassengers}</td>
          </tr>
          <tr>
            <td className="bold">Payment ID</td>
            <td>{ride.paymentID}</td>
          </tr>
          <tr>
            <td className="bold">Amount (Rs)</td>
            <td>{ride.amount}</td>
          </tr>
          <tr>
            <td className="bold">Payment Type</td>
            <td>{ride.paymentType}</td>
          </tr>
          <tr>
            <td className="bold">Payment Status</td>
            <td>{ride.paymentStatus}</td>
          </tr>
        </tbody>
      </table>

      {/* Display Passenger Details in Cards */}
      <Box sx={{ mt: 4 }}>
        <h2>Ride Passenger Details</h2>
        <Grid container spacing={3}>
          {ride.passengers.map((passenger, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ padding: 2 }}>
                <CardContent>
                  <Typography variant="h6">{`Passenger ID: ${passenger.passengerID}`}</Typography>
                  <Divider sx={{ my: 1 }} />

                  {/* Display Passenger Information in Text */}
                  <Typography variant="body1"><b>Name:</b> {passenger.name}</Typography>
                  <Typography variant="body1"><b>Age:</b> {passenger.age}</Typography>
                  <Typography variant="body1"><b>Pick-Up Location: </b>{passenger.pickUpLocation}</Typography>
                  <Typography variant="body1"><b>Drop-Off Location:</b> {passenger.dropOffLocation}</Typography>
                  <Typography variant="body1"><b>Payment Type: </b>{passenger.paymentType}</Typography>
                  <Typography variant="body1"><b>Payment Status: </b>{passenger.paymentStatus}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default RideDetails;
