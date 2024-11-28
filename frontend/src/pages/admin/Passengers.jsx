import React from 'react';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
   import Button from '@mui/material/Button';

   import '../../styles/tables.css'
   import { shouldQuickFilterExcludeHiddenColumns } from '@mui/x-data-grid/hooks/features/filter/gridFilterUtils';
const Passengers = () => {
  const handleEdit = (id) => {
    alert(`Edit row with ID: ${id}`);
    // Add your edit functionality here
  };

  const handleDelete = (id) => {
    alert(`Delete row with ID: ${id}`);
    // Add your delete functionality here
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: false, // Make it editable if required
    },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'ratings', headerName: 'Ratings', width: 90 },

    {
      field: 'gender',
      headerName: 'Gender',
      width: 120,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
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
    {
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
    }
  ];


  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', email: 'someone@gmail.com',    totalRides:2,
       
      completedRides:2,
       
    cancelledRides:0,   phoneNumber: '+1234567890', ratings:3.5,   gender: 'Female' },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei',  email: 'someone2@gmail.com',  totalRides:2,completedRides:1, cancelledRides:1,phoneNumber: '+1234364890', ratings:5,gender: 'Male' },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime',  email: 'someone1@gmail.com',  totalRides:0,completedRides:0, cancelledRides:0,phoneNumber: '+1234467890',ratings:5,gender: 'Others'},
    { id: 4, lastName: 'Stark', firstName: 'Arya', email: 'someone2@gmail.com',  totalRides:200,completedRides:155, cancelledRides:45, phoneNumber: '+1234567840',ratings:4,gender: 'Female'},
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys',  email: 'someone@gmail.com',  totalRides:2,completedRides:1, cancelledRides:1,phoneNumber: '+1234547890',ratings:4.5, gender: 'Female'},
    { id: 6, lastName: 'Melisandre', firstName: null,  email: 'someone@gmail.com',   totalRides:2,completedRides:1, cancelledRides:1,phoneNumber: '+1234562890',ratings:3,gender: 'Female'},
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara',   email: 'someone@gmail.com',  totalRides:2,completedRides:1, cancelledRides:1, phoneNumber: '+1234567890',ratings:5,gender: 'Male' },
    { id: 8, lastName: 'Frances', firstName: 'Rossini',  email: 'someone4@gmail.com',  totalRides:2,completedRides:1, cancelledRides:1, phoneNumber: '+1233567890',ratings:3.5,gender: 'Others' },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey',  email: 'someone@gmail.com',  totalRides:2,completedRides:1, cancelledRides:1,phoneNumber: '+1234563890',ratings:0, gender: 'Female' },
  ];

  return (
    <div className="main-content">
    <div className="header">
      <h1>Welcome to Passengers</h1>
      <button className="button">Add new User</button>
    </div>
    <div>
    <div style={{ marginTop: '20px' }}>

    <Box sx={{ height: 500, width: '100%'  }}>
  <DataGrid
    className="dataGrid"
    rows={rows}
    columns={columns}
    
    slots={{toolbar:GridToolbar}}
    
    slotProps={{toolbar:{showQuickFilter:true,
      quickFilterProps:{ debounceMs:500}
    }
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
    disableColumnFilter
    disableColumnSelector
    disableDensitySelector
    
  />
</Box>
</div>
    </div>
  </div>
  
  );
}

export default Passengers;
// add total rides completed rides cancelled rides