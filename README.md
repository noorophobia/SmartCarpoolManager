

# Smart Carpool Manager
The **Smart Carpool Manager** is a web-based interface designed for managing and overseeing the carpooling platform. As an admin, you can manage users, drivers, ride requests, and track overall system activity. This admin panel is built using the MERN stack (MongoDB, Express, React, Node.js).

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Usage](#usage)
 
## Features
- **User Management**: Admins can view, edit, and delete user profiles, including passengers and drivers.
- **Driver Management**: Admins can add, edit, or remove drivers from the system. They can also review driver stats (total rides, completed rides, etc.).
- **Ride Management**: Admins can track active, completed, and canceled rides. They can also manually assign or reassign rides to drivers.
- **Ride History**: The system allows admins to view detailed history of all rides.
- **Payment Management**: View and manage payment history and transaction details.
- **Notifications**: Send alerts and notifications to users or drivers as needed.
- **Analytics**: View and manage real-time statistics and usage reports related to drivers and passengers.
- **Admin Authentication**: Secure login and role-based access to ensure only authorized personnel can access the panel.

## Tech Stack
- **Frontend**: React.js
  - A JavaScript library for building the user interface of the admin panel.
- **Backend**: Node.js with Express
  - Provides the API that interacts with the database for all admin operations.
- **Database**: MongoDB
  - Stores admin data, user profiles, ride requests, transaction records, etc.
- **Authentication**: JWT (JSON Web Tokens)
  - Securely authenticate admin users to ensure that only authorized personnel can access sensitive admin data.
- **UI Framework**: Material-UI
  - A React component library for creating a responsive, modern, and easy-to-use UI.

## Setup

### Prerequisites
- Node.js (v14 or above)
- MongoDB (use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting or a local MongoDB instance)

### Clone the Repository
```bash
git clone https://github.com/yourusername/smart-carpool-admin.git
cd smart-carpool-admin
```

### Backend Setup

1. Navigate to the **backend** directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add the necessary environment variables:
   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```


### Frontend Setup

1. Navigate to the **frontend** directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Go to Root directory :
  ```bash
  npm start
  ```

4. Visit [http://localhost:5173](http://localhost:5173) to access the Admin Panel.

### MongoDB Configuration

Ensure that your MongoDB instance is running. You can use a local MongoDB setup or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting. The connection string should be added to the `.env` file mentioned above.

## Usage

1. Open the Admin Panel in your browser (`http://localhost:5173`).
2. Log in using your admin credentials (ensure you're authenticated via JWT).
3. Once logged in, you will have access to:
   - **Dashboard**: Overview of recent activity, number of users, drivers, and ongoing rides.
   - **User Management**: View, edit, and delete users.
   - **Driver Management**: Add or remove drivers, manage their ride statistics.
   - **Ride Management**: View and manage active, completed, and canceled rides.
   - **Analytics**: View ride, user, and financial analytics for reports.

   test cases:

   backend ->  npx jest --coverage --runInBand
   npm test