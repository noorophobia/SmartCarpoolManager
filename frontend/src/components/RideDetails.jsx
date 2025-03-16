import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography, Divider } from "@mui/material";
import "../styles/rideDetails.css";

const RideDetails = () => {
  const rideID = localStorage.getItem("id");
  const passengerId = localStorage.getItem("passengerid");
  const driverId = localStorage.getItem("driverid");

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting...");
          return;
        }

        const response = await fetch(`http://localhost:5000/single-rides/${rideID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setRide(data);
        } else {
          console.error("Error fetching ride:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch ride details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideID]);

  if (loading) return <div>Loading ride details...</div>;
  if (!ride) return <div className="ride-details-container not-found">Ride not found</div>;

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
              
   {/*   <tr><td className="bold">Ride ID</td><td>{ride._id}</td></tr>*/}
          <tr><td className="bold">Pick-Up Location</td><td>{ride.requestOrigin}</td></tr>
          <tr><td className="bold">Drop-Off Location</td><td>{ride.requestDestination}</td></tr>
          <tr><td className="bold">Ride Status</td><td>{ride.status}</td></tr>
          <tr><td className="bold">Fare (Rs)</td><td>{ride.requestFare}</td></tr>
          <tr><td className="bold">Ride Type</td><td>{ride.requestType}</td></tr>
          <tr><td className="bold">Completed At</td><td>{new Date(ride.completedAt).toLocaleString()}</td></tr>
          <tr><td className="bold">Car Model</td><td>{ride.car}</td></tr>
          <tr><td className="bold">Car Number</td><td>{ride.carNumber}</td></tr>
        </tbody>
      </table>

      {/* Passenger & Driver Details in Cards */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Passenger Card */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6">Passenger Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1"><b>Name:</b> {ride.passengerName}</Typography>
                <Typography variant="body1"><b>Passenger ID:</b> 
                  {passengerId ? (
                    <Link 
                      to={`/passenger-details`} 
                      style={{ color: "blue", marginLeft: "8px" }}
                      onClick={() => localStorage.setItem("id", ride.passengerId)}
                    >
                      {passengerId}
                    </Link>
                  ) : "N/A"}
                </Typography>
                <Typography variant="body1"><b>Location:</b> {ride.requestOrigin}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Driver Card */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6">Driver Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1"><b>Name:</b> {ride.driverName}</Typography>
                <Typography variant="body1"><b>Driver ID:</b> 
                  {driverId ? (
                    <Link 
                      to={`/drivers/${ride.driverID}`} 
                      style={{ color: "blue", marginLeft: "8px" }}
                      onClick={() => localStorage.setItem("driverId", ride.driverID)}
                    >
                      {driverId}
                    </Link>
                  ) : "N/A"}
                </Typography>
                <Typography variant="body1"><b>Car:</b> {ride.car} ({ride.carNumber})</Typography>
                <Typography variant="body1"><b>Contact:</b> {ride.driverNumber}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default RideDetails;
