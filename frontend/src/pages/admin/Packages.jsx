import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Card, CardContent, CardActions } from "@mui/material";

import '../../styles/tables.css';

import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token")); // Retrieve token from localStorage
  const [newPackage, setNewPackage] = useState({
    name: "",
    duration: "",
    discount: "",
    fee: "",
  });
  const [editingPackage, setEditingPackage] = useState(null);
  const [commission, setCommission] = useState(10); // Default commission rate
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog visibility

  // Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/packages", {
          headers: { Authorization: `Bearer ${token}` }, // Include token in header
        });
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    const fetchCommission = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rate-settings", {
          headers: { Authorization: `Bearer ${token}` }, // Include token in header
        });
        setCommission(response.data.commission);
      } catch (error) {
        console.error("Error fetching commission:", error);
      }
    };

    if (token) {
      fetchPackages();
      fetchCommission();
    } else {
      console.log("No token available");
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage({ ...newPackage, [name]: value });
  };

  const handleAddPackage = async () => {
    if (newPackage.name && newPackage.duration && newPackage.discount && newPackage.fee) {
      try {
        const response = await axios.post(
          "http://localhost:5000/packages",
          newPackage,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPackages([...packages, response.data]);
        setNewPackage({ name: "", duration: "", discount: "", fee: "" });
      } catch (error) {
        console.error("Error adding package:", error);
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleEditClick = (pkg) => {
    setEditingPackage(pkg);
  };

  const handleDeletePackage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Package deleted")
       setPackages((prevPackages) => prevPackages.filter((pkg) => pkg._id !== id));

    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const handleUpdatePackage = async () => {
    try {
      // Ensure you are updating by the correct _id
      console.log(editingPackage._id);
      const response = await axios.put(
        `http://localhost:5000/packages/${editingPackage._id}`,
        editingPackage,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Update the local state by matching on _id instead of id
      setPackages(
        packages.map((pkg) =>
          pkg._id === editingPackage._id ? response.data : pkg
        )
      );
      setEditingPackage(null);
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };
  

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPackage({ ...editingPackage, [name]: value });
  };
  

  const handleCommissionChange = async (e) => {
    setCommission(e.target.value);
    try {
      await axios.put(
        "http://localhost:5000/api/rate-settings/commission",
        { commission: e.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
     } catch (error) {
      console.error("Error updating commission:", error);
    }
  };
  const columns = [
    { field: 'name', headerName: 'Package Name', width: 180 },
    { field: 'duration', headerName: 'Duration', width: 150 },
    { field: 'discount', headerName: 'Discount', width: 150 },
    { field: 'fee', headerName: 'Fee', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button
            style={{ padding: 0, minWidth: '40px', height: '40px', backgroundColor: 'transparent' }}
            onClick={() => handleEditClick(params.row)}  // Pass the entire row (pkg) to handleEditClick
            >
            <img
              src="/edit_icon.svg"
              alt="Edit Button"
              style={{ width: '30px', height: '30px', objectFit: 'contain' }}
            />
          </Button>
          <Button
            style={{
              padding: 0,
              minWidth: '40px',
              height: '40px',
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => handleDeletePackage(params.row._id)}  // Use params.row._id for delete
            >
            <img
              src="/delete_icon.svg"
              alt="Delete Button"
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain',
              }}
            />
          </Button>
        </div>
      ),
    }
  ];

  return (
      <div className="main-content">
          <div className="header">
            <h1>    Packages and Commission </h1>
            <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
       >
        Add New Package
      </Button>
          </div>
          
    <Box>
     
 

      {/* Add New Package Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Package</DialogTitle>
        <DialogContent>
          <TextField
            label="Package Name"
            name="name"
            value={newPackage.name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Duration (e.g., 1 Week, 1 Month)"
            name="duration"
            value={newPackage.duration}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Discount (e.g., 15%)"
            name="discount"
            value={newPackage.discount}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Fee (e.g., 700)"
            name="fee"
            value={newPackage.fee}
            type="number"
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddPackage} color="primary" variant="contained">
            Add Package
          </Button>
        </DialogActions>
      </Dialog>

      {/* Packages Table */}
      <Box sx={{ marginBottom: 4 }}>
          
      <div style={{ marginTop: '20px' }}>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            className="dataGrid"
            rows={packages}
            columns={columns}
            getRowId={(row) => row._id}  // Use the unique id field for each package
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            pageSizeOptions={[5, 10, 20, 100]}
            disableRowSelectionOnClick
            disableColumnSelector
          />
        </Box>
      </div>
    
      </Box>

      {/* Commission Rate */}
 
<Card sx={{ maxWidth: 500, marginTop: 3 }}>
  <CardContent>
    <Typography variant="h6">Commission Rate</Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        marginTop: 2,
      }}
    >
      <TextField
        label="Commission Rate (%)"
        type="number"
        value={commission}
        onChange={handleCommissionChange}
        sx={{ flexGrow: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => alert(`Commission rate updated to ${commission}%`)}
      >
        Update
      </Button>
    </Box>
  </CardContent>
  <CardActions sx={{ justifyContent: "flex-end" }}>
    {/* You can add extra actions here if needed */}
  </CardActions>
</Card>

         

      {/* Edit Package Dialog */}
      {editingPackage && (
        <Dialog open={!!editingPackage} onClose={() => setEditingPackage(null)}>
          <DialogTitle>Edit Package</DialogTitle>
          <DialogContent>
            <TextField
              label="Package Name"
              name="name"
              value={editingPackage.name}
              onChange={handleEditInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Duration"
              name="duration"
              value={editingPackage.duration}
              onChange={handleEditInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Discount"
              name="discount"
              value={editingPackage.discount}
              onChange={handleEditInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Fee"
              name="fee"
              value={editingPackage.fee}
              type="number"
              onChange={setCommission(e.target.value)}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingPackage(null)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdatePackage} color="primary" variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
    </div>
  );
};

export default Packages;
