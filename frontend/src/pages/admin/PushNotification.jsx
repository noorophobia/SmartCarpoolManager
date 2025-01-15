import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,		
	DialogActions,		
DialogContent,			DialogTitle,
  Button,
} from "@mui/material";


import ReactQuill, { Quill } from "react-quill";	
 	import "react-quill/dist/quill.snow.css"; // Import styles for the editor		
	import ImageResize from "quill-image-resize-module-react";		
			
	// Register the image resize module		
	Quill.register("modules/imageResize", ImageResize);
const PushNotification = () => {
  const [recipientType, setRecipientType] = useState("allPassengers");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [images, setImages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); 
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    // Imgbb API endpoint
    const apiKey = "40c7d1f33a00acd8ecd5ed77b2bff4a9";
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok && result.success) {
      return result.data.url; // Return the URL of the uploaded image
    } else {
      alert("Image upload failed.");
      return null;
    }
  };

  const handleSendNotification = async () => {
    if (!message.trim()) {
      alert("Please enter a notification message.");
      return;
    }

    if (recipientType === "specificEmail" && !email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }


    // Find all image URLs in the message
    const imageUrls = [];
    const imageTags = message.match(/<img[^>]+src="([^">]+)"/g);
    if (imageTags) {
      imageTags.forEach((tag) => {
        const src = tag.match(/src="([^">]+)"/)[1];
        if (src.startsWith("data:image")) {
          imageUrls.push(src); // Add base64 image URLs
        }
      });
    }

    // Upload all images to Imgbb
    const uploadedImages = await Promise.all(
      imageUrls.map(async (src) => {
        if (src.startsWith("data:image")) {
          const base64Data = src.split(",")[1];
          const byteArray = new Uint8Array(atob(base64Data).split("").map((char) => char.charCodeAt(0)));
          const blob = new Blob([byteArray], { type: "image/png" });
          const file = new File([blob], "image.png", { type: "image/png" });
          return await handleImageUpload(file);
        }
      })
    );

    // Replace base64 URLs with the uploaded image URLs in the message
    let updatedMessage = message;
    uploadedImages.forEach((uploadedImageUrl) => {
      if (uploadedImageUrl) {
        updatedMessage = updatedMessage.replace(/data:image[^"]+/g, uploadedImageUrl);
      }
    });

    const payload = {
      recipientType,
      email: recipientType === "specificEmail" ? email : null,
      message: updatedMessage,
      subject:subject,
    };

    try {
      const response = await fetch("http://localhost:5000/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Notification sent successfully!");
      } else {
        alert(`Failed to send notification: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("An error occurred while sending the notification.");
    }

    // Clear inputs after sending
    setEmail("");
    setMessage("");
    setRecipientType("allPassengers");
    const imageHandler = () => {
      const range = this.quill.getSelection();
      const value = prompt("Enter image URL");
      if (value) {
        this.quill.insertEmbed(range.index, "image", value);
        const image = document.querySelector("img[src='" + value + "']");
        if (image) {
          image.style.maxWidth = "150px"; // Resize image to 150px
          image.style.height = "auto"; // Maintain aspect ratio
        }
      }
    };


  };
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "50px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "30px",
          maxWidth: "800px",
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
        <TextField
              label="Enter SubjectLine"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ marginBottom: "20px" }}
            />
       
        {/* Open Dialog Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleOpenDialog}
          sx={{
            padding: "10px 0",
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Enter Message
        </Button>

        {/* Dialog for Message Input */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "600" } }} // Custom width for the dialog
        >
          <DialogTitle>Enter Notification Message</DialogTitle>
          <DialogContent>
            <ReactQuill
              value={message}
              onChange={setMessage}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline"],
                  ["link", "image"], // Add image option in toolbar
                  [{ align: [] }],
                  ["clean"],
                ],
                imageResize: {
                  modules: ["Resize", "DisplaySize"], // Enable image resizing
                },
              }}
              style={{ height: 500, marginBottom: "20px" }} // Increased height of the editor
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSendNotification} color="primary">
              Send Notification
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default PushNotification;
