import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import Header from "./header"
import { Link } from 'react-router-dom';
import config from "../config";

const UsersTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    console.error('No token found in local storage');
                    return;
                }

                const response = await axios.get(`${config.BASE_URL}/admin/user-stats`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                setUsers(response.data.allUsers);
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <Header/>
            <div className="m-11 p-4 shadow-md shadow-green-500 bg-white shadow-md shadow-green-500 rounded-lg mt-16" style={{ marginTop: '7rem' }}>
                <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>All Users</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="border px-4 py-2">S.No</th>
                            <th className="border px-4 py-2">Username</th>
                            <th className="border px-4 py-2">UserID</th>
                            <th className="border px-4 py-2">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td className="border px-4 py-2 text-center">{index + 1}</td>
                                <td className="border px-4 py-2">{user.name}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <Link to={`/user-details/${user.email}`}><FaEye size={20} /> </Link>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;