import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";

const PushNotification= () => {
  const [recipientType, setRecipientType] = useState("allPassengers"); // Default recipient type
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSendNotification = () => {
    if (!message.trim()) {
      alert("Please enter a notification message.");
      return;
    }

    if (recipientType === "specificEmail" && !email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    // Prepare the payload
    const payload = {
      recipientType,
      email: recipientType === "specificEmail" ? email : null,
      message,
    };

    // Simulate sending notification (replace this with an API call)
    console.log("Notification Sent:", payload);
    alert("Notification sent successfully!");

    // Clear inputs after sending
    setEmail("");
    setMessage("");
    setRecipientType("allPassengers");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "30px",
          maxWidth: "600px",
          width: "100%",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Page Title */}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#3f51b5" }}
        >
          Send Push Notifications
        </Typography>
        <Typography
          variant="body1"
          align="center"
          gutterBottom
          sx={{ color: "#757575" }}
        >
          Notify passengers or drivers about important updates in a few clicks.
        </Typography>

        {/* Recipient Selection */}
        <Box sx={{ marginTop: "20px" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#3f51b5" }}
          >
            Select Recipient:
          </Typography>
          <RadioGroup
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
            sx={{ marginBottom: "20px" }}
          >
            <FormControlLabel
              value="allPassengers"
              control={<Radio />}
              label="All Passengers"
            />
            <FormControlLabel
              value="allDrivers"
              control={<Radio />}
              label="All Drivers"
            />
            <FormControlLabel
              value="specificEmail"
              control={<Radio />}
              label="Specific Email"
            />
          </RadioGroup>

          {/* Email Input (Visible only when "specificEmail" is selected) */}
          {recipientType === "specificEmail" && (
            <TextField
              label="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ marginBottom: "20px" }}
            />
          )}
        </Box>

        {/* Notification Message Input */}
        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#3f51b5" }}
          >
            Notification Message:
          </Typography>
          <TextField
            label="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ marginBottom: "20px" }}
          />
        </Box>

        {/* Send Notification Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendNotification}
          sx={{
            padding: "10px 0",
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Send Notification
        </Button>
      </Paper>
    </Box>
  );
};

export default PushNotification;
