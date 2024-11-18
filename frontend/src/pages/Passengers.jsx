import React from 'react';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
   import Button from '@mui/material/Button';

import '../styles/passengers.css';
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
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row.id)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    }
  ];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', email: 'someone@gmail.com', gender: 'Female' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei',  email: 'someone2@gmail.com', gender: 'Male' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime',  email: 'someone1@gmail.com', gender: 'Others'},
  { id: 4, lastName: 'Stark', firstName: 'Arya', email: 'someone2@gmail.com', gender: 'Female'},
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys',  email: 'someone@gmail.com', gender: 'Female'},
  { id: 6, lastName: 'Melisandre', firstName: null,  email: 'someone@gmail.com', gender: 'Female'},
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara',   email: 'someone@gmail.com', gender: 'Male' },
  { id: 8, lastName: 'Frances', firstName: 'Rossini',  email: 'someone4@gmail.com', gender: 'Others' },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey',  email: 'someone@gmail.com', gender: 'Female' },
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
  />
</Box>
</div>
    </div>
  </div>
  
  );
}

export default Passengers;
