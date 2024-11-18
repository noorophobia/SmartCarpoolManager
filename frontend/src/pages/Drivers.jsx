import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

 import { shouldQuickFilterExcludeHiddenColumns } from '@mui/x-data-grid/hooks/features/filter/gridFilterUtils';

const Drivers = () => {
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
    { field: 'cnic', headerName: 'CNIC', width: 150 },
    {
      field: 'vehicleBrand',
      headerName: 'Vehicle Brand',
      width: 180,
      editable: true,
    },
    {
      field: 'vehicleName',
      headerName: 'Vehicle Name',
      width: 150,
      editable: true,
    },
    {
      field: 'vehicleColor',
      headerName: 'Vehicle Color',
      width: 120,
      editable: true,
    },
    {
      field: 'vehicleID',
      headerName: 'Vehicle ID',
      width: 150,
      editable: true,
    },
    {
      field: 'vehicleType',
      headerName: 'Vehicle Type',
      width: 150,
      editable: true,
    },
    {
      field: 'licenseNumber',
      headerName: 'License Number',
      width: 180,
    },
    {
      field: 'totalSeatsCapacity',
      headerName: 'Total Seats Capacity',
      type: 'number',
      width: 180,
      editable: true,
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
    },
  ];

  const rows = [
    {
      id: 1,
      cnic: '12345-1234567-1',
      vehicleBrand: 'Toyota',
      vehicleName: 'Corolla',
      vehicleColor: 'Red',
      vehicleID: 'V1234',
      vehicleType: 'Sedan',
      licenseNumber: 'ABC123',
      totalSeatsCapacity: 5,
    },
    {
      id: 2,
      cnic: '12345-1234567-2',
      vehicleBrand: 'Honda',
      vehicleName: 'Civic',
      vehicleColor: 'Blue',
      vehicleID: 'V5678',
      vehicleType: 'Sedan',
      licenseNumber: 'DEF456',
      totalSeatsCapacity: 5,
    },
    {
      id: 3,
      cnic: '12345-1234567-3',
      vehicleBrand: 'Ford',
      vehicleName: 'Mustang',
      vehicleColor: 'Black',
      vehicleID: 'V9876',
      vehicleType: 'Coupe',
      licenseNumber: 'GHI789',
      totalSeatsCapacity: 4,
    },
    // Add more rows as needed
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Drivers</h1>
        <button className="button">Add new Driver</button>
      </div>
      <div>
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
      </div>
    </div>
  );
};

export default Drivers;
