import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import '../../styles/contactUs.css';
const ContactUs = () => {
  // State for handling Dialog open/close and selected complaint data
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Mock data for contact us requests
  const rows = [
    {
      id: 1,
      userID: "1",
      userName: "Ali Khan",
      email: "ali.khan@example.com",
      phone: "+92300XXXXXXX",
      complaint: "App crashes after login Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

    },
    {
      id: 2,
      userID: "2",
      userName: "Sara Ahmed",
      email: "sara.ahmed@example.com",
      phone: "+92301YYYYYYY",
      complaint: "Payment not processed correctly",
    },
    {
      id: 3,
      userID: "3",
      userName: "Mohammad Tariq",
      email: "mohammad.tariq@example.com",
      phone: "+92302ZZZZZZZ",
      complaint: "Cannot find recent rides in history",
    },
  ];

  // Columns for the DataGrid
  const columns = [
    { field: "userID", headerName: "User ID", width: 120 },
    { field: "userName", headerName: "User Name", width: 180 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 180 },
    { field: "complaint", headerName: "Complaint", width: 300 },
    {
      field: "view",
      headerName: "Action",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleViewComplaint(params.row)}
        >
          View 
        </Button>
      ),
    },
  ];

  const handleViewComplaint = (row) => {
    setSelectedComplaint(row); // Set the selected complaint details
    setOpenDialog(true); // Open the dialog box
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog box
  };

  columns.forEach((column) => (column.align = "left ")); // Set all columns to 'center' alignment
  columns.forEach((column) => (column.headerAlign = "left"));//t header to 'center' alignment

  return (
    <div className="main-content">
      <div className="header">
        <h1>Contact Us - Complaints</h1>
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

      {/* Dialog for displaying complaint details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <div>
              <p><strong>User ID:</strong> {selectedComplaint.userID}</p>
              <p><strong>Name:</strong> {selectedComplaint.userName}</p>
              <p><strong>Email:</strong> {selectedComplaint.email}</p>
              <p><strong>Phone:</strong> {selectedComplaint.phone}</p>
              <p><strong>Complaint:</strong> {selectedComplaint.complaint}</p>
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

export default ContactUs;
