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
 const RatingsAndReviews = () => {
  // State for handling dialog open/close and selected row data
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  // Mock data for the rides
  const rows = [
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
    },
    {
      id: 2,
      rideID: "RIDE124",
      passengerID: "124",
      passengerName: "Sara Ahmed",
      passengerRating: 3.7,
      passengerReview: "Decent ride, could be better.",
      driverID: "457",
      driverName: "Emily Clark",
      driverRating: 4.2,
      driverReview: "Good passenger, but a bit late. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

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
      field: "view",
      headerName: "Action",
      width: 90,
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
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
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
            pageSizeOptions={[5, 10, 20]} // Allow users to choose 5, 10, or 20 records per page
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
          />
        </Box>
      </div>

      {/* Dialog for displaying ratings and reviews */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle  
        >Ratings and Reviews Details</DialogTitle>
        <DialogContent sx={{ padding: "30px" ,marginTop:"30px"

        }}>
          {selectedRide && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* Passenger Info Card */}
              <Card style={{ width: "48%" ,background:"#E0E0E0"

               }}>
                <CardHeader title="Passenger Review
                " />
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
                </CardContent>
              </Card>

              {/* Driver Info Card */}
              <Card style={{ width: "48%",background:"#E0E0E0"

               }}>
                <CardHeader title="Driver Review
                " />
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
