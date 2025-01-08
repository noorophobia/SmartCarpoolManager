import React, { useState } from "react";
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
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Basic",
      duration: "1 Week",
      discount: "15%",
      fee: 700,
    },
    {
      id: 2,
      name: "Premium",
      duration: "1 Month",
      discount: "25%",
      fee: 2500,
    },
  ]);

  const [newPackage, setNewPackage] = useState({
    name: "",
    duration: "",
    discount: "",
    fee: "",
  });

  const [editingPackage, setEditingPackage] = useState(null);
  const [commission, setCommission] = useState(10); // Default commission rate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage({ ...newPackage, [name]: value });
  };

  const handleAddPackage = () => {
    if (newPackage.name && newPackage.duration && newPackage.discount && newPackage.fee) {
      setPackages([...packages, { id: Date.now(), ...newPackage }]);
      setNewPackage({ name: "", duration: "", discount: "", fee: "" });
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleEditClick = (pkg) => {
    setEditingPackage(pkg);
  };

  const handleDeletePackage = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const handleUpdatePackage = () => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === editingPackage.id ? editingPackage : pkg
      )
    );
    setEditingPackage(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPackage({ ...editingPackage, [name]: value });
  };

  const handleCommissionChange = (e) => {
    setCommission(e.target.value);
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
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.id}</TableCell>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                  <TableCell>{pkg.discount}</TableCell>
                  <TableCell>{pkg.fee}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(pkg)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
            <Button
              onClick={() => setEditingPackage(null)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePackage}
              color="primary"
              variant="contained"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Packages;
