import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, Tooltip as LineTooltip, Legend
} from 'recharts';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useLocation } from "react-router-dom";
import axios from 'axios';

const COLORS = ['#4CAF50', '#FFC107'];

const Home = () => {
  const [view, setView] = useState('monthly');
  const [driverCount, setDriverCount] = useState(0);
  const [passengerCount, setPassengerCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [totalRides, setTotalRides] = useState(0);
  const [completedRides, setCompletedRides] = useState(0);
  const [cancelledRides, setCancelledRides] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchDriverCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/drivers/api/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (typeof response.data.totalDrivers === "number") {
          setDriverCount(response.data.totalDrivers);
        }
      } catch (error) {
        console.error("Error fetching driver count:", error);
        setDriverCount("Error");
      }
    };

    const fetchPassengerCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/passengers/api/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (typeof response.data.totalPassengers === "number") {
          setPassengerCount(response.data.totalPassengers);
        }
      } catch (error) {
        console.error("Error fetching passenger count:", error);
        setPassengerCount("Error");
      }
    };

    const fetchPendingCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/drivers/api/pending-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (typeof response.data.pendingApplications === "number") {
          setPendingCount(response.data.pendingApplications);
        }
      } catch (error) {
        console.error("Error fetching pending count:", error);
      }
    };

    const fetchApprovedCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/drivers/api/approved-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (typeof response.data.approvedApplications === "number") {
          setApprovedCount(response.data.approvedApplications);
        }
      } catch (error) {
        console.error("Error fetching approved count:", error);
      }
    };

    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/rides-with-composite-ids", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (Array.isArray(data.allMappings)) {
          const formatted = data.allMappings.map((ride, index) => ({
            id: index + 1,
            rideID: ride.compositeId,
            driverID: ride.driverID,
            driverCompositeId: ride.driverCompositeId || "N/A",
            rideStatus: ride.rideStatus?.toLowerCase() || "completed",
            date: ride.date ? new Date(ride.date) : null,
            revenue: ride.revenue || 0,
            fare: ride.fare || 0,
            mode: ride.mode
          }));

          setRevenueData(formatted);

          // Stats
          const total = formatted.length;
          const completed = formatted.filter(r => r.rideStatus === "completed").length;
          const cancelled = formatted.filter(r => r.rideStatus === "cancelled").length;
          const earnings = formatted.reduce((sum, r) => sum + (r.revenue || 0), 0);

          setTotalRides(total);
          setCompletedRides(completed);
          setCancelledRides(cancelled);
          setTotalEarnings(earnings);

          // Revenue Charts
          const monthlyMap = {};
          const dailyMap = {};

          formatted.forEach(ride => {
            if (!ride.date) return;

            const monthKey = ride.date.toLocaleString('default', { month: 'short' });
            const dayKey = `${monthKey}-${ride.date.getDate()}`;

            monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + ride.revenue;
            dailyMap[dayKey] = (dailyMap[dayKey] || 0) + ride.revenue;
          });

          const monthlyArr = Object.entries(monthlyMap).map(([name, revenue]) => ({ name, revenue }));
          const dailyArr = Object.entries(dailyMap).map(([name, revenue]) => ({ name, revenue }));

          // Sort daily data by date
          dailyArr.sort((a, b) => {
            const [monthA, dayA] = a.name.split("-");
            const [monthB, dayB] = b.name.split("-");
            return parseInt(dayA) - parseInt(dayB);
          });

          setMonthlyData(monthlyArr);
          setDailyData(dailyArr);
        }
      } catch (error) {
        console.error("Error fetching revenue:", error.message);
      }
    };

    fetchDriverCount();
    fetchPassengerCount();
    fetchPendingCount();
    fetchApprovedCount();
    fetchRevenue();
  }, []);

  const handleViewToggle = (_, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const pieData = [
    { name: "Approved Requests", value: approvedCount },
    { name: "Pending Requests", value: pendingCount },
  ];

  return (
    <div className="home">
      <span className="heading">Analytics</span>

      {/* Dashboard Boxes */}
      <div className="box box1">
        <span className="box-heading">Total Drivers</span>
        <span className="number">{driverCount}</span>
        <img src="driver_black.svg" alt="Driver Icon" className="icon" />
      </div>
      <div className="box box2">
        <span className="box-heading">Pending Applications</span>
        <span className="number">{pendingCount}</span>
        <img src="driver_black.svg" alt="Pending Icon" className="icon" />
      </div>
      <div className="box box3">
        <span className="box-heading">Approved Applications</span>
        <span className="number">{approvedCount}</span>
        <img src="pending_black.svg" alt="Approved Icon" className="icon" />
      </div>
      <div className="box box4">
        <span className="box-heading">Earnings (Rs)</span>
        <span className="number">{totalEarnings}</span>
        <img src="dollar_black.svg" alt="Earnings Icon" className="icon" />
      </div>
      <div className="box box5">
        <span className="box-heading">Total Rides</span>
        <span className="number">{totalRides}</span>
        <img src="car_black.svg" alt="Rides Icon" className="icon" />
      </div>
      <div className="box box6">
        <span className="box-heading">Completed Rides</span>
        <span className="number">{completedRides}</span>
        <img src="car_black.svg" alt="Completed Icon" className="icon" />
      </div>
      <div className="box box7">
        <span className="box-heading">Cancelled Rides</span>
        <span className="number">{cancelledRides}</span>
        <img src="car_black.svg" alt="Cancelled Icon" className="icon" />
      </div>
      <div className="box box8">
        <span className="box-heading">Total Passengers</span>
        <span className="number">{passengerCount}</span>
        <img src="passenger_black.svg" alt="Passenger Icon" className="icon" />
      </div>

      <span className="subheading">Analytics Charts</span>

      {/* Revenue Chart */}
      <div className="box box9">
        <span className="title">Revenue</span>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={view === 'daily' ? dailyData : monthlyData}
            margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
          >
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis />
            <LineTooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>

        <div className="view-toggle">
          <ToggleButtonGroup
            value={view}
            orientation="vertical"
            exclusive
            onChange={handleViewToggle}
            aria-label="Revenue View"
            sx={{ padding: '10px 20px', color: 'black' }}
          >
            <ToggleButton value="daily" sx={{ backgroundColor: 'white', color: 'black' }}>
              Daily Revenue
            </ToggleButton>
            <ToggleButton value="monthly" sx={{ backgroundColor: 'white', color: 'black' }}>
              Monthly Revenue
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      {/* Pie Chart */}
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
