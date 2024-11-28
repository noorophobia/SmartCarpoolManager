import React, { useState } from "react";
import { TextField, Button, Grid, Switch, FormControlLabel } from "@mui/material";

const Settings = () => {
  const [email, setEmail] = useState("jon@example.com");
  const [password, setPassword] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved");
  };

  return (
    <div className="settings-container">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h3>Account Settings</h3>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <h3>Privacy and Security</h3>
          <FormControlLabel
            control={<Switch checked={twoFA} onChange={() => setTwoFA(!twoFA)} />}
            label="Enable Two-Factor Authentication"
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
