import React, { useState } from 'react';
import '../styles/home.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LineChart, Line, XAxis, YAxis, Tooltip as LineTooltip, Legend } from 'recharts';
import { ToggleButton, ToggleButtonGroup } from '@mui/material'; // Import Material UI components
import { useLocation } from "react-router-dom";

// Line Chart Data and Setup
const lineData = [
  { name: 'Jan', revenue: 2400 },
  { name: 'Feb', revenue: 1398 },
  
];
const dailyRevenueData = [
  { name: 'Jan-1 ', revenue: 100 },
  { name: 'Jan-2  ', revenue: 150 },
  { name: 'Jan-3', revenue: 120 },
  { name: 'Jan-4', revenue: 130 },
  { name: 'Jan-5', revenue: 110 },
  { name: 'Jan-6', revenue: 170 },
  { name: 'Jan-7', revenue: 140 },
];
 // Pie Chart Data for Approved and Pending Requests
const pieData = [
  { name: 'Approved Requests', value: 80 },  
  { name: 'Pending Requests', value: 20 },   
];

// Colors for Pie chart segments
const COLORS = ['#4CAF50', '#FFC107'];

const Home = () => {
    
  const [view, setView] = useState('monthly'); // State to track current view (daily or monthly)
  
  // Toggle between daily and monthly views
  const handleViewToggle = () => {
    setView((prevView) => (prevView === 'daily' ? 'monthly' : 'daily'));
  };

  return (
    <div className="home">
      <span className="heading">Analytics</span>
      <div className="box box1">
        <span className="box-heading">Total Drivers</span>
        <span className="number">12</span>
        <img src="driver_black.svg" alt="Driver Icon" className="icon" />
      </div>
      <div className="box box2">
        <span className="box-heading">Active Drivers</span>
        <span className="number">12</span>
        <img src="driver_black.svg" alt="Driver Icon" className="icon" />
      </div>
      <div className="box box3">
        <span className="box-heading">Pending Applications</span>
        <span className="number">12</span>
        <img src="pending_black.svg" alt="Form Icon" className="icon" />
      </div>
      <div className="box box4">
        <span className="box-heading">Earnings</span>
        <span className="number">12</span>
        <img src="dollar_black.svg" alt="Earnings Icon" className="icon" />
      </div>
      <div className="box box5">
        <span className="box-heading">Total Rides</span>
        <span className="number">32</span>
        <img src="car_black.svg" alt="Rides Icon" className="icon" />
      </div>
      <div className="box box6">
        <span className="box-heading">Completed Rides</span>
        <span className="number">16</span>
        <img src="car_black.svg" alt="Completed Icon" className="icon" />
      </div>
      <div className="box box7">
        <span className="box-heading">Cancelled Rides</span>
        <span className="number">12</span>
        <img src="car_black.svg" alt="Cancelled Icon" className="icon" />
      </div>
      <div className="box box8">
        <span className="box-heading">Total Passengers</span>
        <span className="number">10</span>
        <img src="passenger_black.svg" alt="Passengers Icon" className="icon" />
      </div>

      <span className="subheading">Analytics Charts</span>

      
      <div className="box box9">
        <span className="title">Revenue</span>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
  data={view === 'daily' ? dailyRevenueData : lineData}
  margin={{ top: 10, right: 10, left: 10, bottom: 40 }} 
>
  {/* Adjust for daily or monthly data */}

            <XAxis dataKey="name"
   angle={-45}  
   textAnchor="end" 
   interval={0} 
            />
            <YAxis />
            <LineTooltip />
     


            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          
        </ResponsiveContainer>
         {/* Button to toggle between daily and monthly view */}
         <div className="view-toggle">
        <ToggleButtonGroup
           value={view}
          orientation="vertical"
          sx={{
              padding: '10px 20px',  
            color:'black',
           }}
          exclusive
          onChange={handleViewToggle}
          aria-label="Revenue View"
        >
          <ToggleButton
           sx={{
           color:'black',
          backgroundColor:"white"
        }}
          
          value="daily">Daily Revenue</ToggleButton>
          <ToggleButton
            sx={{
              color:'black',
             backgroundColor:"white"
           }}
          value="monthly">Monthly Revenue</ToggleButton>
        </ToggleButtonGroup>
      </div>

      </div>

      {/* Pie Chart for Approved and Pending Requests */}
      <div className="box box10">
        <span className="title">Requests Status</span>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
              formatter={(value, name) => [`${value} Requests`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend for Approved and Pending Requests */}
        <div className="legend">
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: COLORS[0] }}></div>
            <span className="legend-text">Approved Requests</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: COLORS[1] }}></div>
            <span className="legend-text">Pending Requests</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
