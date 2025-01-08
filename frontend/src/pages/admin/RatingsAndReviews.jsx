import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import "../../styles/ratingAndReviews.css";

const RatingsAndReviews = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rows, setRows] = useState([
    {
      id: 1,
      rideID: "RIDE123",
      passengerID: "1",
      passengerName: "Ali Khan",
      passengerRating: 4.5,
      passengerReview: "Great experience!",
      driverID: "2",
      driverName: "John Doe",
      driverRating: 4.8,
      driverReview: "Smooth ride, friendly driver!",
      status: "new",
    },
    {
      id: 2,
      rideID: "RIDE124",
      passengerID: "124",
      passengerName: "Sara Ahmed",
      passengerRating: 2.5,
      passengerReview: "Decent ride, could be better.",
      driverID: "457",
      driverName: "Emily Clark",
      driverRating: 3.2,
      driverReview: "Good passenger, but a bit late.",
      status: "resolved",
    },
  ]);

  // Columns for the DataGrid
  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 120 },
    { field: "passengerName", headerName: "Passenger Name", width: 180 },
    { field: "driverName", headerName: "Driver Name", width: 180 },
    {
      field: "passengerReview",
      headerName: "Passenger Review",
      width: 250,
    },
    {
      field: "driverReview",
      headerName: "Driver Review",
      width: 250,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.row.status === "new" ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {params.row.status === "new" ? "New" : "Resolved"}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleViewDetails(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  // Handle opening the dialog and setting the selected ride data
  const handleViewDetails = (row) => {
    setSelectedRide(row);
    setOpenDialog(true);

    // Update row status to "in-progress" if it is "new"
    const updatedRows = rows.map((r) =>
      r.id === row.id && r.status === "new" ? { ...r, status: "in-progress" } : r
    );
    setRows(updatedRows);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);

    // Update row status to "resolved"
    const updatedRows = rows.map((r) =>
      r.id === selectedRide.id && r.status === "in-progress"
        ? { ...r, status: "resolved" }
        : r
    );
    setRows(updatedRows);
  };

  // Handle blocking passenger
  const handleBlockPassenger = (rideId) => {
    alert(`Passenger for ride ${rideId} has been blocked`);
    // Logic to block passenger
  };

  // Handle blocking driver
  const handleBlockDriver = (rideId) => {
    alert(`Driver for ride ${rideId} has been blocked`);
    // Logic to block driver
  };

  // Center the columns
  columns.forEach((column) => (column.align = "left"));
  columns.forEach((column) => (column.headerAlign = "left"));

  return (
    <div className="main-content">
      <div className="header">
        <h1>Ratings and Reviews</h1>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            getRowClassName={(params) =>
              params.row.status === "new" ? "new-complaint-row" : ""
            }
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
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
          />
        </Box>
      </div>

      {/* Dialog for displaying ratings and reviews */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Ratings and Reviews Details</DialogTitle>
        <DialogContent sx={{ padding: "30px", marginTop: "30px" }}>
          {selectedRide && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* Passenger Info Card */}
              <Card style={{ width: "48%", background: "#E0E0E0" }}>
                <CardHeader title="Passenger Review" />
                <CardContent>
                  <Typography variant="body1">
                    <strong>Passenger Name:</strong> {selectedRide.passengerName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Passenger Rating:</strong> {selectedRide.passengerRating}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Passenger Review:</strong> {selectedRide.passengerReview}
                  </Typography>
                  {/* Block Button for Passenger */}
                  {selectedRide.passengerRating < 3 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleBlockPassenger(selectedRide.rideID)}
                      style={{ marginTop: "10px" }}
                    >
                      Block Passenger
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Driver Info Card */}
              <Card style={{ width: "48%", background: "#E0E0E0" }}>
                <CardHeader title="Driver Review" />
                <CardContent>
                  <Typography variant="body1">
                    <strong>Driver Name:</strong> {selectedRide.driverName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Driver Rating:</strong> {selectedRide.driverRating}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Driver Review:</strong> {selectedRide.driverReview}
                  </Typography>
                  {/* Block Button for Driver */}
                  {selectedRide.driverRating < 3 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleBlockDriver(selectedRide.rideID)}
                      style={{ marginTop: "10px" }}
                    >
                      Block Driver
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RatingsAndReviews;
