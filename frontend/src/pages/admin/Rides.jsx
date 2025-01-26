import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Rides = () => {
  const [rides, setRides] = useState([]); // Holds the rides data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [driversData, setDriversData] = useState({}); // Holds all drivers' data
  const [passengerData, setPassengerData] = useState({}); // Holds passenger data
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
/*
  // Fetch rides data
  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      setError(null); // Reset error on each fetch

      try {
        const response = await axios.get("http://localhost:5000/rides", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const ridesData = response.data;
          setRides(ridesData); // Set the fetched rides data

          // Extract driver IDs and fetch driver data for all drivers in one go
          const driverIds = [...new Set(ridesData.map((ride) => ride.driverId))];
          const driverPromises = driverIds.map((driverId) =>
            axios.get(`http://localhost:5000/drivers/${driverId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
          );

          // Fetch driver data
          const driverResponses = await Promise.all(driverPromises);
          const driversMap = driverResponses.reduce((acc, driver) => {
            if (driver.status === 200) {
              acc[driver.data._id] = driver.data; // Map driver ID to driver data
            }
            return acc;
          }, {});

          setDriversData(driversMap); // Set the drivers data

          // Now fetch passenger data
          const passengerIds = ridesData.flatMap((ride) => ride.passengerIds);
          const uniquePassengerIds = [...new Set(passengerIds)];
          const passengerPromises = uniquePassengerIds.map((passengerId) =>
            axios.get(`http://localhost:5000/passengers/${passengerId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
          );

          const passengerResponses = await Promise.all(passengerPromises);
          const passengersMap = passengerResponses.reduce((acc, passenger) => {
            if (passenger.status === 200) {
              acc[passenger.data._id] = passenger.data;
            }
            return acc;
          }, {});

          setPassengerData(passengersMap); // Set passenger data
        }
      } catch (err) {
        console.error("Error fetching rides data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
     
    fetchRides();
  }, [token]);
  
  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 120 },
    { field: "pickUpLocation", headerName: "Pick-Up Location", width: 200 },
    { field: "dropOffLocation", headerName: "Drop-Off Location", width: 200 },
    { field: "rideMode", headerName: "Ride Mode", width: 150 },
    { field: "rideStatus", headerName: "Ride Status", width: 150 },
    {
      field: "passenger",
      headerName: "Passenger (Composite ID)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const passenger = passengerData[params.value];
        return (
          <Link to={`/passenger-details/${params.value}`}>
            <Button variant="text" color="primary" size="small">
              {passenger ? passenger.compositeId : "Loading..."}
            </Button>
          </Link>
        );
      },
    },
    {
      field: "driver",
      headerName: "Driver (Composite ID)",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const driver = driversData[params.value]; // Fetch driver data from state
        return (
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={() => navigate(`/drivers/${params.value}`)}
          >
            {driver ? driver.compositeId : "Loading..."}
          </Button>
        );
      },
    },
    {
      field: "viewDetails",
      headerName: "View Details",
      width: 200,
      renderCell: (params) => (
        <Link to={`/ride-details/${params.row.rideID}`}>
          <Button variant="contained" color="primary" size="small">
            View Details
          </Button>
        </Link>
      ),
    },
  ];*/

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Rides</h1>
       </div>
      <div style={{ marginTop: "20px" }}>
        <Box sx={{ height: 500, width: "100%" }}>
      {/*   <DataGrid
            className="dataGrid"
            rows={rides.map((ride) => ({
              ...ride,
              id: ride._id, 
               driver: ride.driverId, 
              passenger: ride.passengerIds[0], 
            }))}
            columns={columns}
            pageSize={5}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
          **/}

        </Box>
      </div>

      {/* Display loading or error messages */}
      {loading && <p>Loading data...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Rides;
