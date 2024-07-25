import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './header';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import config from "../config";

const RequestDetails = () => {
    const { requestId } = useParams();
    const [requestData, setRequestData] = useState(null);
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchToken = () => {
            const storedToken = localStorage.getItem('adminToken');
            setToken(storedToken);
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (requestId && token) {
            axios.get(`${config.BASE_URL}/admin/requestss/${requestId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => {
                    setRequestData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching request details:', error);
                });
        }
    }, [requestId, token]);

    if (!requestData) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-50">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="bg-white shadow-md shadow-green-500  rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-4xl text-center font-bold text-gray-800 mb-2">Request Details</h2>
                            <h3 className="text-2xl font-semibold text-gray-700">Request ID: <span className="text-gray-500">{requestData.requestId}</span></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 hover:scale-105 hover:bg-gray-100">
                                <h4 className="text-xl text-center font-medium text-gray-800 mb-2">User Information</h4>
                                <p className="text-lg"><strong>Name:</strong> {requestData.createdBy}</p>
                                <p className="text-lg"><strong>Email:</strong> {requestData.email}</p>
                                <p className="text-lg"><strong>Mobile Number:</strong> {requestData.mobileNumber}</p>
                                <Link to={`../user-details/${requestData.email}`} className="flex items-center text-blue-600 hover:underline mt-4">
                                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                                    View User Profile
                                </Link>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 hover:scale-105 hover:bg-gray-100">
                                <h4 className="text-xl text-center font-medium text-gray-800 mb-2">Request Details</h4>
                                <p className="text-lg"><strong>Date:</strong> {requestData.date}</p>
                                <p className="text-lg"><strong>Contact Time:</strong> {requestData.timeToConnect}</p>
                                <p className="text-lg"><strong>Pickup Address:</strong> {requestData.pickupAddress}</p>
                                <p className="text-lg"><strong>Language:</strong> {requestData.language}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 mb-6 hover:scale-95 hover:bg-gray-100">
                            <h4 className="text-xl font-medium text-gray-800 mb-2">Description</h4>
                            <p className="text-lg">{requestData.description}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 mb-6 hover:scale-95 hover:bg-gray-100">
                            <h4 className="text-xl font-medium text-gray-800 mb-2">Documents</h4>
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
                        <div className="bg-white p-4 rounded-lg shadow-md shadow-blue-500 hover:scale-95 hover:bg-gray-100">
                            <h4 className="text-xl font-medium text-gray-800 mb-2">Current Status</h4>
                            <p className="text-lg text-blue-600">{requestData.status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetails;