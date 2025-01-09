import React, { useState, useEffect } from "react";
import axios from "axios";
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
      setPackages(packages.filter((pkg) => pkg.id !== id));
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
      alert(`Commission rate updated to ${e.target.value}%`);
    } catch (error) {
      console.error("Error updating commission:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Packages and Commission
      </Typography>

      {/* Add New Package */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Add New Package</Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
          }}
        >
          <TextField
            label="Package Name"
            name="name"
            value={newPackage.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Duration (e.g., 1 Week, 1 Month)"
            name="duration"
            value={newPackage.duration}
            onChange={handleInputChange}
          />
          <TextField
            label="Discount (e.g., 15%)"
            name="discount"
            value={newPackage.discount}
            onChange={handleInputChange}
          />
          <TextField
            label="Fee (e.g., 700)"
            name="fee"
            value={newPackage.fee}
            type="number"
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleAddPackage}>
            Add Package
          </Button>
        </Box>
      </Box>

      {/* Packages Table */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Existing Packages</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Package Name</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(packages) ? (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>{pkg.id}</TableCell>
                    <TableCell>{pkg.name}</TableCell>
                    <TableCell>{pkg.duration}</TableCell>
                    <TableCell>{pkg.discount}</TableCell>
                    <TableCell>{pkg.fee}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditClick(pkg)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeletePackage(pkg.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>No packages available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Commission Rate */}
      <Box>
        <Typography variant="h6">Commission Rate</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            maxWidth: 400,
            marginTop: 2,
          }}
        >
          <TextField
            label="Commission Rate (%)"
            type="number"
            value={commission}
            onChange={handleCommissionChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert(`Commission rate updated to ${commission}%`)}
          >
            Update
          </Button>
        </Box>
      </Box>

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
              onChange={handleEditInputChange}
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
  );
};

export default Packages;
