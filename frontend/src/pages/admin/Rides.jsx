import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import axios from "axios";

const Rides = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null); // Track clicked driver ID
  const navigate = useNavigate(); // Initialize navigate

  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  // Fetch driver details based on the selected driver ID
  useEffect(() => {
    const fetchDriver = async () => {
      setLoading(true);
      try {
        console.log(`Fetching driver for ID: ${selectedDriverId}`);
        const response = await axios.get(
          `http://localhost:5000/drivers/composite/${selectedDriverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  // Handle response
  if (response.status === 200) {
    console.log('Driver updated successfully');
      setDriver(response.data); // Set the fetched driver data
        console.log("Fetched driver data: ", response.data); // Log the driver data
        console.log("Driver ID: ", response.data._id);
     // Use response.data._id directly instead of waiting for the state to update
        navigate(`/drivers/${response.data._id}`);
}
      } catch (err) {
        setError(err.message); // Handle error
      } finally {
        setLoading(false); // Set loading state to false
      }
    }
  
    
      fetchDriver();
    }
  , [selectedDriverId, token]); // Re-run the effect when the selectedDriverId changes
 // Navigate when driver details are available
 
  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 120 },
    { field: "pickUpLocation", headerName: "Pick-Up Location", width: 200 },
    { field: "dropOffLocation", headerName: "Drop-Off Location", width: 200 },
    { field: "rideMode", headerName: "Ride Mode", width: 150 },
    { field: "rideStatus", headerName: "Ride Status", width: 150 },
    {
      field: "passenger",
      headerName: "Passenger (ID)",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Link to={`/passenger-details/${params.value}`}>
          <Button variant="text" color="primary" size="small">
            {params.value}
          </Button>
        </Link>
      ),
    },
    {
      field: "driver",
      headerName: "Driver (ID)",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={() => setSelectedDriverId(params.value)} // Set selectedDriverId on click
        >
          {params.value}
        </Button>
      ),
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
  ];

  const rows = [
    {
      id: 1,
      rideID: "RIDE123",
      pickUpLocation: "Model Town",
      dropOffLocation: "Liberty Market",
      rideMode: "Carpool",
      rideStatus: "Ongoing",
      passenger: "1",
      driver: "DR-002", // Driver ID
    },
    {
      id: 2,
      rideID: "RIDE124",
      pickUpLocation: "DHA",
      dropOffLocation: "Gulberg",
      rideMode: "Single",
      rideStatus: "Completed",
      passenger: "124",
      driver: "DR-003", // Another Driver ID
    },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Rides</h1>
        <button className="button">Add New Ride</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            className="dataGrid"
            rows={rows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            pageSizeOptions={[5, 10, 20]} // Allow users to choose 5, 10, or 20 records per page
            disableRowSelectionOnClick
          />
        </Box>
      </div>

      {/* Display the driver details below */}
      {loading && <p>Loading driver details...</p>}
      {error && <p>Error: {error}</p>}
      {driver && (
        <div>
          <h2>Driver Details</h2>
          <p>
            <strong>ID:</strong> {driver.id}
          </p>
          <p>
            <strong>Name:</strong> {driver.name}
          </p>
          <p>
            <strong>License:</strong> {driver.licenseNumber}
          </p>
          {/* You can display more driver details here */}
        </div>
      )}
    </div>
  );
};

export default Rides;
