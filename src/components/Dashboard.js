import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './header';
import config from "../config";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const Dashboard = () => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [inProgressRequests, setInProgressRequests] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);
  const [rejectedRequests, setRejectedRequests] = useState(0);
  const [latestUsers, setLatestUsers] = useState([]);
  const [monthlyRequests, setMonthlyRequests] = useState(Array(12).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No token found in local storage');
          return;
        }

        const userStatsResponse = await axios.get(`${config.BASE_URL}/admin/user-stats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const { totalUserCount, latestUsers } = userStatsResponse.data;
        setTotalUsers(totalUserCount);
        setLatestUsers(latestUsers);

        const requestsResponse = await axios.get(`${config.BASE_URL}/admin/request-counts`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (requestsResponse.data) {
          setTotalRequests(requestsResponse.data.totalRequestCount);
          setPendingRequests(requestsResponse.data.pendingCount);
          setInProgressRequests(requestsResponse.data.inProgressCount);
          setCompletedRequests(requestsResponse.data.completedCount);
          setRejectedRequests(requestsResponse.data.rejectedCount);
        } else {
          console.error('Unexpected response structure:', requestsResponse.data);
        }

        const monthlyRequestsResponse = await axios.get(`${config.BASE_URL}/admin/monthly-requests`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (monthlyRequestsResponse.data) {
          setMonthlyRequests(monthlyRequestsResponse.data.monthlyRequests);
        } else {
          console.error('Unexpected response structure:', monthlyRequestsResponse.data);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Requests',
        data: monthlyRequests,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData1 = {
    labels: ['Completed', 'Pending', 'In Progress', 'Rejected'],
    datasets: [
      {
        data: [completedRequests, pendingRequests, inProgressRequests, rejectedRequests],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Header />

      <div className="mt-16 min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md shadow-green-500 rounded-lg p-6">
          <div className="flex flex-wrap justify-between gap-4 mb-4">
            <div className="bg-blue-300 text-center p-4 rounded-lg flex flex-col justify-center h-36 w-48 sm:w-48 lg:w-48 hover:scale-105 hover:bg-blue-500">
              <h2 className="text-4xl font-bold mb-2">{totalUsers}</h2>
              <p>Total Users</p>
            </div>
            <div className="bg-gray-300 text-center p-4 rounded-lg flex flex-col justify-center h-36 w-48 sm:w-48 lg:w-48 hover:scale-105 hover:bg-gray-500">
              <h2 className="text-4xl font-bold mb-2">{totalRequests}</h2>
              <p className="text-lg">Total Requests</p>
            </div>
            <div className="bg-yellow-300 text-center p-4 rounded-lg flex flex-col justify-center h-36 w-48 sm:w-48 lg:w-48 hover:scale-105 hover:bg-yellow-500">
              <h2 className="text-4xl font-bold mb-2">{pendingRequests}</h2>
              <p className="text-lg">Pending Requests</p>
            </div>
            <div className="bg-pink-400 text-center p-4 rounded-lg flex flex-col justify-center h-36 w-48 sm:w-48 lg:w-48 hover:scale-105 hover:bg-pink-700">
              <h2 className="text-4xl font-bold mb-2">{inProgressRequests}</h2>
              <p className="text-lg">In Progress Requests</p>
            </div>
            <div className="bg-green-400 text-center p-4 rounded-lg flex flex-col justify-center h-36 w-48 sm:w-48 lg:w-48 hover:scale-105 hover:bg-green-500">
              <h2 className="text-4xl font-bold mb-2">{completedRequests}</h2>
              <p className="text-lg">Completed Requests</p>
            </div>
            <div className="bg-red-400 text-center p-4 rounded-lg flex flex-col justify-center h-36 w-48 sm:w-48 lg:w-48 hover:scale-105 hover:bg-red-600">
              <h2 className="text-4xl font-bold mb-2">{rejectedRequests}</h2>
              <p className="text-lg">Rejected Requests</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <Link
              to="/view-all-users"
              className="flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-1/2 sm:mr-2 mb-2 sm:mb-0"
            >
              View All Users
            </Link>
            <Link
              to="/view-and-manage-requests"
              className="flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-1/2"
            >
              View and Manage All Requests
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow-md shadow-blue-500 rounded-lg p-4">
              <h3 className="font-bold mb-2 bg-gray-300 p-4 mb-2 rounded-lg shadow-md text-xl flex justify-center items-center">New Users ↓</h3>
              <ul>
                {latestUsers.length > 0 ? (
                  latestUsers.map(user => (
                    <li key={user._id} className="p-4 mb-2 rounded-lg shadow-lg shadow-blue-500 hover:scale-105 hover:bg-blue-300">{user.name}</li>
                  ))
                ) : (
                  <li className="p-4 mb-2 rounded-lg shadow-lg shadow-blue-500">No users found</li>
                )}
              </ul>
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row">
              <div className="overflow-x-auto bg-green-100 rounded-lg mb-2 md:mb-0 md:mr-4 w-full p-2 hover:scale-105 hover:bg-blue-200">
                <Bar data={barData} options={{
                  responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Monthly Requests (Present Year)' } }, scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
                }} />
              </div>
              <div className="overflow-x-auto bg-green-100 rounded-lg p-2 w-full hover:scale-105 hover:bg-blue-200">
                <Pie data={doughnutData1} options={{
                  responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Requests Summary' } },
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;