import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './header';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import config from "../config";

const ManageRequest = () => {
    const { requestId } = useParams();
    const [requestData, setRequestData] = useState(null);
    const [token, setToken] = useState('');
    const [status, setStatus] = useState('');
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        if (storedToken) {
            setToken(storedToken);
        } else {
            console.error('No token found in local storage');
        }
    }, []);

    useEffect(() => {
        if (requestId && token) {
            axios.get(`${config.BASE_URL}/admin/requestss/${requestId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => {
                    setRequestData(response.data);
                    setStatus(response.data.status);
                })
                .catch(error => {
                    console.error('Error fetching request details:', error);
                });
        }
    }, [requestId, token]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleReceiptChange = (e) => {
        setReceipt(e.target.files[0]);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('status', status);
        if (receipt) {
            formData.append('receipt', receipt);
        }

        axios.put(`${config.BASE_URL}/admin/request-status/${requestId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        })
            .then(response => {
                alert('Request updated successfully');
                setRequestData(response.data);
            })
            .catch(error => {
                console.error('Error updating request:', error);
            });
    };

    if (!requestData) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-50">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="bg-white shadow-md shadow-green-500 rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6"><h2 className="text-4xl text-center font-bold text-gray-800 mb-2">Manage Request Details</h2>
                            <h2 className="text-4xl font-bold text-gray-800 mb-2">Request ID: <span className="text-gray-600">{requestData.requestId}</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 hover:scale-105 hover:bg-gray-100">
                                <h4 className="text-xl font-medium text-gray-800 mb-4">Request Details</h4>
                                <p className="text-lg"><strong>Date:</strong> {requestData.date}</p>
                                <p className="text-lg"><strong>Mobile Number:</strong> {requestData.mobileNumber}</p>
                                <p className="text-lg"><strong>Contact Time:</strong> {requestData.timeToConnect}</p>
                                <p className="text-lg"><strong>Pickup Address:</strong> {requestData.pickupAddress}</p>
                                <p className="text-lg"><strong>Language:</strong> {requestData.language}</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 hover:scale-105 hover:bg-gray-100">
                                <h4 className="text-xl font-medium text-gray-800 mb-4">User Information</h4>
                                <p className="text-lg"><strong>Name:</strong> {requestData.createdBy}</p>
                                <p className="text-lg"><strong>Email:</strong> {requestData.email}</p>
                                <Link to={`../user-details/${requestData.email}`} className="flex items-center text-blue-600 hover:underline mt-4">
                                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                                    View User Profile
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 mb-6 hover:scale-95 hover:bg-gray-100">
                            <h4 className="text-xl font-medium text-gray-800 mb-4">Description</h4>
                            <p className="text-lg">{requestData.description}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 mb-6 hover:scale-95 hover:bg-gray-100">
                            <h4 className="text-xl font-medium text-gray-800 mb-4">Documents</h4>
                            <ul className="list-disc pl-5">
                                {requestData.documents.map((doc) => (
                                    <li key={doc._id} className="mb-2">
                                        <a
                                            href={`${config.BASE_URL}/${doc.filepath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {doc.filename}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 mb-6 hover:scale-95 hover:bg-gray-100">
                            <h4 className="text-xl font-medium text-gray-800 mb-4">Current Status</h4>
                            <p className="text-lg text-blue-600">{requestData.status}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 mb-6 hover:scale-95 hover:bg-gray-100">
                            <h4 className="text-xl font-medium text-gray-800 mb-4">Update Request</h4>
                            <label className="block text-lg font-bold mb-2">Update Status:</label>
                            <select value={status} onChange={handleStatusChange} className="w-full p-2 border border-gray-300 rounded mb-4">
                                <option value="Pending">Pending</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Rejected">Rejected</option>
                            </select>

                            <label className="block text-lg font-bold mb-2">Upload Receipt:</label>
                            <input type="file" onChange={handleReceiptChange} className="w-full p-2 border border-gray-300 rounded mb-4" />

                            <button onClick={handleSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Update and Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageRequest;