import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-gray-600 text-white shadow-md fixed top-0 left-0 w-full z-50 p-2">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center">
                    <span className="text-xl font-semibold">Admin Panel</span>
                </div>

                <div className="hidden md:flex space-x-4">
                    <Link
                        to="/dashboard"
                        className="hover:bg-gray-500 px-4 py-2 rounded"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/view-all-users"
                        className="hover:bg-gray-500 px-4 py-2 rounded"
                    >
                        All User
                    </Link>
                    <Link
                        to="/view-and-manage-requests"
                        className="hover:bg-gray-500 px-4 py-2 rounded"
                    >
                        All Request
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center hover:bg-gray-500 px-4 py-2 rounded"
                    >
                        <svg
                            className="w-6 h-6 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m10 4H3a1 1 0 01-1-1V5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1z"
                            ></path>
                        </svg>
                        Logout
                    </button>
                </div>

                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-gray-600 text-white">
                    <nav className="px-4 pb-4 space-y-2">
                        <Link
                            to="/dashboard"
                            className="block hover:bg-gray-500 px-2 py-1 rounded"
                            onClick={toggleMenu}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/view-all-users"
                            className="block hover:bg-gray-500 px-2 py-1 rounded"
                            onClick={toggleMenu}
                        >
                            All User
                        </Link>
                        <Link
                            to="/view-and-manage-requests"
                            className="block hover:bg-gray-500 px-2 py-1 rounded"
                            onClick={toggleMenu}
                        >
                            All Request
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left hover:bg-gray-500 px-2 py-1 rounded"
                        >
                            <svg
                                className="w-6 h-6 mr-2 inline"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m10 4H3a1 1 0 01-1-1V5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1z"
                                ></path>
                            </svg>
                            Logout
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;