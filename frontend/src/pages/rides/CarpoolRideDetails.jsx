import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography, Divider } from "@mui/material";
import CarpoolRideService from "../../services/CarpoolRideService"; // Import service
import "../../styles/rideDetails.css";

const CarpoolRides = () => {
  const rideID = localStorage.getItem("rideid");
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

        const rideService = new CarpoolRideService(token);
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
          <tr><td className="bold">Pick-Up Location</td><td>{ride.pickup}</td></tr>
          <tr><td className="bold">Drop-Off Location</td><td>{ride.dropoff}</td></tr>
          <tr><td className="bold">Ride Mode</td><td>{ride.mode}</td></tr>
          <tr><td className="bold">Ride Status</td><td>{ride.rideStatus}</td></tr>
          {ride.rideStatus === "Cancelled" && (
            <tr><td className="bold">Cancellation Reason</td><td>{ride.cancellationReason}</td></tr>
          )}
          <tr><td className="bold">No of Passengers</td><td>{ride.additionalPassengers}</td></tr>
          <tr><td className="bold">Payment ID</td><td>{ride.paymentID}</td></tr>
          <tr><td className="bold">Amount (Rs)</td><td>{ride.fare}</td></tr>
          <tr><td className="bold">Payment Type</td><td>{ride.paymentType}</td></tr>
          <tr><td className="bold">Payment Status</td><td>{ride.paymentStatus}</td></tr>
          <tr>
            <td className="bold">Driver</td>
            <td>
              {driverId ? (
                <Link
                  to={`/drivers/${ride.driverID}`}
                  style={{ color: "blue", marginLeft: "8px" }}
                  onClick={() => localStorage.setItem("driverId", ride.driverID)}
                >
                  {driverId}
                </Link>
              ) : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Passenger Details */}
      <Box sx={{ mt: 4 }}>
        <h2>Ride Passenger Details</h2>
        <Grid container spacing={3}>
          {Array.isArray(ride.passengerId) && ride.passengerId.length > 0 ? (
            ride.passengerId.map((passenger, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card sx={{ padding: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{`Passenger ID: ${passenger.passengerID}`}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1"><b>Name:</b> {passenger.name}</Typography>
                    <Typography variant="body1"><b>Age:</b> {passenger.age}</Typography>
                    <Typography variant="body1"><b>Pick-Up Location:</b> {passenger.pickUpLocation}</Typography>
                    <Typography variant="body1"><b>Drop-Off Location:</b> {passenger.dropOffLocation}</Typography>
                    <Typography variant="body1"><b>Payment Type:</b> {passenger.paymentType}</Typography>
                    <Typography variant="body1"><b>Payment Status:</b> {passenger.paymentStatus}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ padding: 2, color: "gray" }}>
              No passengers available
            </Typography>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default CarpoolRides;
