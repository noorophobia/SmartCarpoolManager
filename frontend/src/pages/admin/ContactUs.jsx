import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import '../../styles/contactUs.css';

const ContactUs = () => {
  const [complaints, setComplaints] = useState([]); // State for fetched complaints
  const [loading, setLoading] = useState(true); // State to show loading
  const [error, setError] = useState(null); // State to handle errors
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Fetch complaints from the backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/complaints', {
          method: 'GET',
          
        });
         if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }
        const data = await response.json();
        console.log(data)
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Columns for the DataGrid
  const columns = [
    { field: "compositeId", headerName: "Complaint ID", width: 120 },
    { field: "name", headerName: "User Name", width: 180 },
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

  columns.forEach((column) => (column.align = "left"));
  columns.forEach((column) => (column.headerAlign = "left"));

  return (
    <div className="main-content">
      <div className="header">
        <h1>Contact Us - Complaints</h1>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Box sx={{ height: 500, width: "100%" }}>
          {loading ? (
            <p>Loading complaints...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <DataGrid
              className="dataGrid"
              rows={complaints}
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
               disableColumnSelector
               getRowId={(row) => row._id} // Use _id from MongoDB as the unique row ID
            />
          )}
        </Box>
      </div>

      {/* Dialog for displaying complaint details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent   sx={{margin:"20px", background:"#E0E0E0"}}>
          {selectedComplaint && (
            <div>
              <p><strong>Complaint ID:</strong> {selectedComplaint.compositeId}</p>
              <p><strong>Name:</strong> {selectedComplaint.name}</p>
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
