import React from 'react';
import '../styles/home.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'; // Correct import for PieChart
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

 

// Line Chart Data and Setup
// Line Chart Data and Setup
const lineData = [
  { name: 'Jan', uv: 4000, pv: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398 },
  { name: 'March', uv: 2000, pv: 9800 },
  { name: 'April ', uv: 2780, pv: 3908 },
  { name: 'May ', uv: 1890, pv: 4800 },
  { name: 'June', uv: 2390, pv: 3800 },
  { name: 'July', uv: 3490, pv: 4300 },
  { name: 'Aug', uv: 3490, pv: 4300 },
  { name: 'Sep', uv: 3490, pv: 4300 },
  { name: 'Oct', uv: 3490, pv: 4300 },
  { name: 'Nov', uv: 3490, pv: 4300 },
  { name: 'Dec', uv: 3490, pv: 4300 },
];


const Home = () => {
  return (
    <div className="home">
      <span className="heading">Analytics</span>
      <div className="box box1">
        <span className="box-heading">Total Drivers</span>
        <span className="number">12</span>
        <img src="driver.svg" alt="Driver Icon" className="icon" />
      </div>
      <div className="box box2">
        <span className="box-heading">Active Drivers</span>
        <span className="number">12</span>
        <img src="driver.svg" alt="Driver Icon" className="icon" />
      </div>
      <div className="box box3">
        <span className="box-heading">Pending Applications</span>
        <span className="number">12</span>
        <img src="form.svg" alt="Form Icon" className="icon" />
      </div>
      <div className="box box4">
        <span className="box-heading">Earnings</span>
        <span className="number">12</span>
        <img src="earnings.svg" alt="Earnings Icon" className="icon" />
      </div>
      <div className="box box5">
        <span className="box-heading">Total Rides</span>
        <span className="number">32</span>
        <img src="rides.svg" alt="Rides Icon" className="icon" />
      </div>
      <div className="box box6">
        <span className="box-heading">Completed Rides</span>
        <span className="number">16</span>
        <img src="completed.svg" alt="Completed Icon" className="icon" />
      </div>
      <div className="box box7">
        <span className="box-heading">Cancelled Rides</span>
        <span className="number">12</span>
        <img src="cancelled.svg" alt="Cancelled Icon" className="icon" />
      </div>
      <div className="box box8">
        <span className="box-heading">Total Passengers</span>
        <span className="number">10</span>
        <img src="passengers.svg" alt="Passengers Icon" className="icon" />
      </div>

      <span className="heading">Analytics Charts</span>
      <div className="box box9">
         <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
       
    </div>
  );
}

export default Home;
