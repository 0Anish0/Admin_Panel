import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import config from "../config";

const RequestTable = () => {
    const [requests, setRequests] = useState([]);
    const [status, setStatus] = useState('Initiated');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    console.error('No token found in local storage');
                    return;
                }

                const response = await axios.get(`${config.BASE_URL}/admin/requests/${status}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.data && Array.isArray(response.data)) {
                    setRequests(response.data);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, [status]);

    return (
        <div>
            <Header />
            <div className="max-w-7xl mx-auto mt-44 p-17"  style={{ marginTop: '7rem' }}>
                <div className="bg-gray-300 p-4 rounded-lg shadow-md shadow-green-500">
                    <h1 className="text-2xl font-semibold mb-4 text-center">View And Manage Requests</h1>
                    <div className="flex justify-center mb-6">
                        <button
                            className={`py-2 px-4 border-2 rounded-xl ${status === 'Initiated' ? 'bg-yellow-500 border-white text-white' : 'bg-yellow-300 border-yellow-300 text-black hover:bg-yellow-400 hover:border-yellow-600 hover:text-white'} mr-4`}
                            onClick={() => setStatus('Initiated')}>
                            Pending Requests
                        </button>
                        <button
                            className={`py-2 px-4 border-2 rounded-xl ${status === 'InProgress' ? 'bg-blue-500 border-white text-white' : 'bg-blue-300 border-blue-300 text-black hover:bg-blue-400 hover:border-blue-600 hover:text-white'} mr-4`}
                            onClick={() => setStatus('InProgress')}>
                            In Progress Requests
                        </button>
                        <button
                            className={`py-2 px-4 border-2 rounded-xl ${status === 'Completed' ? 'bg-green-500 border-white text-white' : 'bg-green-300 border-green-300 text-black hover:bg-green-400 hover:border-green-600 hover:text-white'} mr-4`}
                            onClick={() => setStatus('Completed')}>
                            Completed Requests
                        </button>
                        <button
                            className={`py-2 px-4 border-2 rounded-xl ${status === 'Rejected' ? 'bg-red-500 border-white text-white' : 'bg-red-300 border-red-300 text-black hover:bg-red-400 hover:border-red-600 hover:text-white'} mr-4`}
                            onClick={() => setStatus('Rejected')}>
                            Rejected Requests
                        </button>
                    </div>
                    <table className="min-w-full text-center bg-white">
                        <thead>
                            <tr className='text-center'>
                                <th className="py-2 px-4 border-b">S.No</th>
                                <th className="py-2 px-4 border-b">Request Id</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">View</th>
                                <th className="py-2 px-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((request, index) => (
                                    <tr key={request._id} className='text-center'>
                                        <td className="py-4 px-6 border-b text-center">{index + 1}</td>
                                        <td className="py-4 px-6 border-b text-center">{request.requestId}</td>
                                        <td className="py-4 px-6 border-b text-center">{request.createdBy}</td>
                                        <td className="py-4 px-6 border-b text-center">
                                            <Link className='text-blue-500' to={`/requests/${request.requestId}`}>👁</Link>
                                        </td>
                                        <td className="py-4 px-6 border-b text-center">
                                            <Link to={`/request/${request.requestId}`} className="text-blue-500">Manage</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="py-2 px-4 border-b text-center" colSpan="5">No requests found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RequestTable;
