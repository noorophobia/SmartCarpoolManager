import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography, Divider } from "@mui/material";
import RideDetailsService from "../../services/RideDetailsService"; // Import service
import "../../styles/rideDetails.css";

const RideDetails = () => {
  const rideID = localStorage.getItem("rideid");
  const passengerId = localStorage.getItem("passengerid");
  const driverId = localStorage.getItem("driverid");

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [location]);

  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const rideService = new RideDetailsService(token);
        const data = await rideService.fetchRideDetails(rideID);
        setRide(data);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRideData();
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

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
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
                      {ride.driverID}
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
