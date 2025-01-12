import React, { useState } from "react";
import axios from "axios";

const Image = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = "YourAPIKEY"; // Replace with your ImgBB API key

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        formData
      );

      /// The response of uploading image is stored tofetch the image
      
      if (response.data.success) {
        setImageDetails(response.data.data);


        // you can store the whole url in db ad imageDetails.url
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>ImgBB Image Upload</h1>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Select an image:</label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <button
        onClick={handleUpload}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {imageDetails && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Image Details:</h2>
          <p>
            <strong>ID:</strong> {imageDetails.id}
          </p>
          <p>
            <strong>URL:</strong>{" "}
            <a href={imageDetails.url} target="_blank" rel="noopener noreferrer">
              {imageDetails.url}
            </a>
          </p>
          <img
            src={imageDetails.url}
            alt="Uploaded"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Image;
