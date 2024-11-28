import React, { useEffect, useState } from 'react';
import '../styles/userDetails.css';  // Import CSS file

const UserDetails = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const dummyData = {
        "1": { id: "1", name: "Ali Khan", email: "ali@example.com", role: "Passenger" },
        "2": { id: "2", name: "John Doe", email: "john@example.com", role: "Driver" },
        "124": { id: "124", name: "Sara Ahmed", email: "sara@example.com", role: "Passenger" },
        "457": { id: "457", name: "Emily Clark", email: "emily@example.com", role: "Driver" },
      };
      setUser(dummyData[userId] || null);
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        {user ? (
          <>
            <h2 className="modalTitle">User Details</h2>
            <p className="modalDetails"><strong>ID:</strong> {user.id}</p>
            <p className="modalDetails"><strong>Name:</strong> {user.name}</p>
            <p className="modalDetails"><strong>Email:</strong> {user.email}</p>
            <p className="modalDetails"><strong>Role:</strong> {user.role}</p>
            <div className="buttonContainer">
              <button className="closeButton" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
