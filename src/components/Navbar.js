"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Box, Avatar, IconButton } from '@mui/material';
import { User, KeyRound, LogOut, Plus, Menu } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/store/features/authSlice';

const Navbar = ({ toggleMenu, isMobile }) => {
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const user = useSelector((state) => state?.auth?.user?.user);
    const router = useRouter();

    const logout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            router.push('/login');
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddCompany = () => {
        router.push('/admin/add-company');
    };

    return (
        <Box
            component="nav"
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 2,
                background: '#3a5afc',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                width: '100%',
                height: '70px',
                minHeight: '70px',
                position: 'sticky',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1100,
                justifyContent: { xs: 'space-between', md: 'flex-end' },
                backdropFilter: 'blur(5px)',
                backgroundColor: 'rgba(58, 90, 252, 0.95)',
            }}
        >
            {isMobile && (
                <IconButton
                    onClick={toggleMenu}
                    sx={{
                        color: 'white',
                    }}
                >
                    <Menu />
                </IconButton>
            )}

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center focus:outline-none"
                >
                    <Avatar
                        src={user?.image}
                        alt={user?.name}
                        sx={{
                            width: { xs: 35, sm: 40 },
                            height: { xs: 35, sm: 40 },
                            cursor: 'pointer',
                            border: '2px solid white'
                        }}
                    />
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs md:text-sm text-gray-500">Welcome, <span className="font-medium text-gray-900">{user?.first_name}</span></p>
                        </div>

                        {user?.role === 'admin' && (
                            <button
                                onClick={handleAddCompany}
                                className="flex w-full items-center px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50 space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add New Company</span>
                            </button>
                        )}

                        <Link
                            href="/user/profile"
                            className="flex items-center px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50 space-x-2"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <User className="w-4 h-4" />
                            <span>My Profile</span>
                        </Link>

                        <Link
                            href="/user/change-password"
                            className="flex items-center px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50 space-x-2"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <KeyRound className="w-4 h-4" />
                            <span>Change Password</span>
                        </Link>

                        <div className="border-t border-gray-100 mt-1">
                            <button
                                onClick={logout}
                                className="flex w-full items-center px-4 py-2 text-xs md:text-sm text-red-600 hover:bg-red-50 space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Box>
    );
};

export default Navbar;
