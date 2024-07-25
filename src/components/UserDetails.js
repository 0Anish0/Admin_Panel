import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from "./header.js";
import config from "../config";

const Card = ({ title, content }) => (
  <div className="bg-white shadow-md shadow-blue-500 rounded-lg p-6 mb-4 transition transform hover:scale-105 hover:bg-gray-100">
    <h3 className="text-xl font-semibold mb-2 transition transform">{title}</h3>
    <p className="text-gray-700 transition-colors hover:text-gray-800">{content}</p>
  </div>
);

const ProfilePictureCard = ({ imageUrl }) => (
  <div className="border-4 flex justify-center items-center bg-white rounded-full border border-blue-500 mb-3 transition transform hover:scale-110 w-44 h-44 mx-auto">
    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
  </div>
);

const UserDetails = () => {
  const { email } = useParams();
  const [userData, setUserData] = useState(null);
  const [requestsData, setRequestsData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/admin/user-details/${email}`, requestOptions);
        setUserData(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchRequestsData = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/admin/request/${email}`, requestOptions);
        setRequestsData(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
    fetchRequestsData();
  }, [email]);

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    try {
      await axios.delete(`${config.BASE_URL}/admin/delete-user/${email}`, requestOptions);
      alert('User deleted successfully');
      navigate('/view-all-users');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBlockUser = async (block) => {
    const confirmBlock = window.confirm(`Are you sure you want to ${block ? 'block' : 'unblock'} this user?`);
    if (!confirmBlock) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    try {
      await axios.put(`${config.BASE_URL}/admin/block-user/${email}`, { block }, requestOptions);
      alert(`User ${block ? 'blocked' : 'unblocked'} successfully`);
      setUserData((prevState) => ({
        ...prevState,
        isBlocked: block,
      }));
    } catch (error) {
      console.error('Error blocking/unblocking user:', error.response || error.message);
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const user = userData;
  const profileImageUrl = user.profilePicture ? `${config.BASE_URL}/${user.profilePicture.filepath}` : 'https://via.placeholder.com/150';
  console.log(profileImageUrl);
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="mt-16 mb-6 w-full max-w-6xl mx-auto p-6">
        <div className="bg-white shadow-md shadow-green-500 rounded-lg p-6 mt-6">
          <h2 className="text-3xl font-bold text-center mb-6">User Details</h2>
          <ProfilePictureCard imageUrl={profileImageUrl} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="User Name:" content={user.name} />
            <Card title="User ID:" content={user._id} />
            <Card title="Address Line 1:" content={user.address1} />
            <Card title="Address Line 2:" content={user.address2} />
            <Card title="Email:" content={user.email} />
            <Card title="Mobile Number:" content={user.mobile} />
          </div>
        </div>

        <div className="mt-8 bg-white shadow-md shadow-green-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Requests</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">S.No</th>
                <th className="border px-4 py-2">Request ID</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">View</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {requestsData.length > 0 ? (
                requestsData.map((requests, index) => (
                  <tr key={requests._id} className="text-center">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{requests.requestId}</td>
                    <td className="border px-4 py-2">{requests.status}</td>
                    <td className="border px-4 py-2">
                      <Link to={`/requests/${requests.requestId}`} className="text-blue-500">👁️</Link>
                    </td>
                    <td className="border px-4 py-2">
                      <Link to={`/request/${requests.requestId}`} className="text-blue-500 hover:underline">Manage</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border px-4 py-2">No requests available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={handleDeleteUser}
          >
            Delete User
          </button>
          <button
            className={`px-4 py-2 rounded transition ${user.isBlocked ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
            onClick={() => handleBlockUser(!user.isBlocked)}
          >
            {user.isBlocked ? 'Unblock User' : 'Block User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;