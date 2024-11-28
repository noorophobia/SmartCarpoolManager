import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import '../../styles/tables.css'
// Dummy data for documents
const documents = [
  { id: 1, name: 'CNIC', url: 'https://example.com/cnic' },
  { id: 2, name: 'Driver License', url: 'https://example.com/license' },
  { id: 3, name: 'Vehicle Registration', url: 'https://example.com/registration' },
];

const Drivers = () => {
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleEdit = (id) => {
    alert(`Edit row with ID: ${id}`);
    // Add your edit functionality here
  };

  const handleDelete = (id) => {
    alert(`Delete row with ID: ${id}`);
    // Add your delete functionality here
  };

  const handleViewDocuments = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'cnic', headerName: 'CNIC', width: 150 },
    { field: 'ratings', headerName: 'Ratings', width: 90 },
    { field: 'vehicleBrand', headerName: 'Vehicle Brand', width: 180, editable: true },
    { field: 'vehicleName', headerName: 'Vehicle Name', width: 150, editable: true },
    { field: 'vehicleColor', headerName: 'Vehicle Color', width: 120, editable: true },
    { field: 'vehicleID', headerName: 'Vehicle ID', width: 150, editable: true },
    { field: 'vehicleType', headerName: 'Vehicle Type', width: 150, editable: true },
    { field: 'licenseNumber', headerName: 'License Number', width: 180 },
    { field: 'totalSeatsCapacity', headerName: 'Total Seats Capacity', type: 'number', width: 180, editable: true },
    {
      field: 'totalRides',
      headerName: 'Total Rides',
      width: 150,
    },
    {
      field: 'completedRides',
      headerName: 'Completed Rides',
      width: 180,
    },
    {
      field: 'cancelledRides',
      headerName: 'Cancelled Rides',
      width: 180,
    },
    { field: 'distanceRatePerKm', headerName: 'Rate Per KM', type: 'number', width: 180, editable: true },
    { field: 'timeRatePerMinute', headerName: 'Rate Per Minute', type: 'number', width: 180, editable: true },
    { field: 'fixedDriverFee', headerName: 'Fixed Driver Fee', type: 'number', width: 180, editable: true },
    { field: 'peakRateMultiplier', headerName: 'Peak Rate Multiplier', type: 'number', width: 180, editable: true },
    { field: 'discounts', headerName: 'Discounts', width: 180, editable: true },
    { field: 'carImage', headerName: 'Car Image', width: 180, renderCell: (params) => <img src={params.value} alt="Car" width="50" /> },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 180, editable: true },
    
    {
      field: 'viewDocuments',
      headerName: 'Documents',
      width: 180,
      renderCell: () => (
        <Button variant="contained" color="default" size="small" onClick={handleViewDocuments}>
          View Documents
        </Button>
      ),
    },{
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
         
         
           <Button   style={{
            padding: 0,
            minWidth: '40px',
            height: '40px',
            backgroundColor: 'transparent',
          }} onClick={() => handleEdit(params.row.id)}>
          <img
            src="/edit_icon.svg" // Replace with the actual path to the driver icon
            alt="Edit Button"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          </Button>
          <Button   style={{
            padding: 0,
            minWidth: '40px',
            height: '40px',
            backgroundColor: 'transparent',
          }} onClick={() => handleDelete(params.row.id)}>
          <img
            src="/delete_icon.svg" // Replace with the actual path to the driver icon
            alt="Delete Button "
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          </Button>
        </>
      ),
    },
    
  ];

  const rows = [
    {
      id: 1,
      name: 'John Doe',
      gender: 'Male',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      cnic: '12345-1234567-1',
      ratings: 4,
      vehicleBrand: 'Toyota',
      vehicleName: 'Corolla',
      vehicleColor: 'Red',
      vehicleID: 'V1234',
      vehicleType: 'Sedan',
      licenseNumber: 'ABC123',
      totalSeatsCapacity: 5,
       totalRides:2,
     
       completedRides:2,
        
     cancelledRides:0,
       
      distanceRatePerKm: 72,
      timeRatePerMinute: 10,
      fixedDriverFee: 50,
      peakRateMultiplier: 1.2,
      discounts: 5,
      carImage: 'https://via.placeholder.com/150',
      dateOfBirth: '1990-05-15',
    },
    // Add more rows as needed
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Drivers</h1>
        <button className="button">Add new Driver</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Box sx={{ height: 500, width: '100%' }}>
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
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>

      {/* Document Management Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Documents</DialogTitle>
        <DialogContent>
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
              </li>
            ))}
          </ul>
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

export default Drivers;
// add total rides completed rides cancelled rides