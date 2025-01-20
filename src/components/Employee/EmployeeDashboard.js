"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
    Users, ChevronRight, Mail, Phone, User, FileText,
    Menu, KeyRound, LogOut,
} from 'lucide-react';
import Link from 'next/link';
import {
    fetchEmployeeApplications,
    checkIn,
    checkOut,
    fetchAttendanceStatus
} from '@/lib/store/features/employeeSlice';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { formatDistanceStrict } from 'date-fns';

const EmployeeDashboard = ({ user, logout }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { applications, isCheckedIn, checkInTime } = useSelector((state) => state.employee);
    const [cameraError, setCameraError] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const [scanner, setScanner] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [elapsedTime, setElapsedTime] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchEmployeeApplications(user._id));
            dispatch(fetchAttendanceStatus(user._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        return () => {
            setIsCancelled(true);
            if (scanner && isRunning) {
                scanner.clear().catch(console.error);
            }
        };
    }, [scanner, isRunning]);

    useEffect(() => {
        let timer;
        if (isCheckedIn && checkInTime) {
            const updateElapsedTime = () => {
                const elapsed = formatDistanceStrict(new Date(checkInTime), new Date(), {
                    unit: 'hour',
                    addSuffix: false
                });
                setElapsedTime(elapsed);
            };

            updateElapsedTime();
            timer = setInterval(updateElapsedTime, 60000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isCheckedIn, checkInTime]);


    const handleCheckIn = async (supervisorId) => {
        if (isProcessing) return;

        try {
            setIsProcessing(true);
            await dispatch(checkIn({ employeeId: user._id, supervisorId: supervisorId })).unwrap();
            setShowScanner(false);
            if (scanner) {
                scanner.clear();
                setScanner(null);
            }
        } catch (error) {
            setCameraError(error.message || 'Check-in failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckOut = async (supervisorId) => {
        if (isProcessing) return;

        try {
            setIsProcessing(true);
            await dispatch(checkOut({ employeeId: user._id, supervisorId: supervisorId })).unwrap();
            setShowScanner(false);
            if (scanner) {
                scanner.clear();
                setScanner(null);
            }
        } catch (error) {
            setCameraError(error.message || 'Check-out failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const onScanSuccess = (decodedText) => {
        try {
            if (scanner) {
                scanner.clear();
                setScanner(null);
                setIsRunning(false);
            }

            const data = JSON.parse(decodedText);

            if (!data.id) {
                setCameraError('Invalid QR code format: missing ID');
                return;
            }

            setScannedData(data.id);
        } catch (error) {
            console.error('Scan processing error:', error);
            setCameraError('Invalid QR code format');
        }
    };

    const onScanError = (error) => {
        if (!error.includes("NotFoundException")) {
            console.error(error);
            setCameraError('Failed to scan QR code');
        }
    };

    const initializeScanner = () => {
        const container = document.getElementById("qr-reader-container");
        if (!container) {
            console.error("QR reader container not found");
            setCameraError("Scanner initialization failed");
            return;
        }

        const qrScanner = new Html5QrcodeScanner(
            "qr-reader-container",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: true,
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                hideHeader: true,
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            },
            false
        );
        const style = document.createElement('style');
        style.innerHTML = `
            #qr-reader-container__dashboard_section_csr span { display: none; }
            #qr-reader-container__scan_region { border: none !important; }
            #qr-reader-container__dashboard_section_swaplink { display: none; }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            try {
                qrScanner.render(onScanSuccess, onScanError);
                setScanner(qrScanner);
                setIsRunning(true);
            } catch (error) {
                console.error('Scanner initialization error:', error);
                setCameraError('Failed to initialize camera');
            }
        }, 100);
    };

    const handleScanClick = () => {
        if (scannedData) {
            handleConfirmScan();
            return;
        }

        setCameraError(null);
        setShowScanner(true);
        setIsCancelled(false);
        setTimeout(initializeScanner, 100);
    };

    const stopScanner = async () => {
        try {
            setIsCancelled(true);
            if (scanner) {
                await scanner.clear();
                setScanner(null);
                const style = document.querySelector('style');
                if (style && style.innerHTML.includes('qr-reader-container')) {
                    style.remove();
                }
            }
        } catch (err) {
            console.error('Failed to stop scanner:', err);
        } finally {
            setShowScanner(false);
            setIsRunning(false);
            setCameraError(null);
            setIsProcessing(false);
            setScannedData(null);
        }
    };

    const handleConfirmScan = async () => {
        if (isProcessing || !scannedData) return;

        try {
            setIsProcessing(true);
            if (isCheckedIn) {
                await handleCheckOut(scannedData);
            } else {
                await handleCheckIn(scannedData);
            }
            setScannedData(null);
        } catch (error) {
            setCameraError(error.message || 'Error processing scan');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, [scanner]);

    const navigateToWorkingInformation = () => {
        router.push('/work');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-2 sm:p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6">
                    {/* Header section */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl sm:text-3xl font-bold text-green-800">Employee Dashboard</h1>
                    </div>

                    <div className="mb-6 p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-xl border border-green-300 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-2xl font-bold mb-2 text-green-800">Work Status</h2>
                                <p className="text-green-700">
                                    {isCheckedIn ? 'Currently Working' : 'Not Checked In'}
                                </p>
                                {isCheckedIn && (
                                    <p className="text-green-600 mt-1">
                                        Duration: {elapsedTime}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={handleScanClick}
                                    className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-sm ${isCheckedIn
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                >
                                    {isCheckedIn ? 'Check Out' : 'Check In'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* QR Scanner Section */}
                    {showScanner && (
                        <div className="mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                                <div className="relative max-w-md mx-auto">
                                    {scannedData ? (
                                        <div>
                                            <p className="text-center mb-3 sm:mb-4 text-sm sm:text-base">
                                                Scanned Data: {scannedData}
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={handleConfirmScan}
                                                    className="w-full bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm sm:text-base"
                                                    disabled={isProcessing}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={stopScanner}
                                                    className="w-full bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm sm:text-base"
                                                    disabled={isProcessing}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                id="qr-reader-container"
                                                className="w-full mx-auto"
                                                style={{
                                                    minHeight: '250px',
                                                    maxWidth: '300px'
                                                }}
                                            ></div>
                                            <button
                                                onClick={stopScanner}
                                                className="mt-3 sm:mt-4 w-full bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm sm:text-base"
                                                disabled={isProcessing}
                                            >
                                                Cancel Scan
                                            </button>
                                        </>
                                    )}
                                    {cameraError && (
                                        <p className="text-red-500 text-center mt-2 text-sm sm:text-base">{cameraError}</p>
                                    )}
                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                            <div className="text-white text-sm sm:text-base">Processing...</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Info Card - Updated for better mobile responsiveness */}
                    <div className="mb-6 bg-green-50 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-20 h-20 sm:w-16 sm:h-16 rounded-full border-2 border-green-200 object-cover"
                                />
                            </div>
                            <div className="text-center sm:text-left flex-grow">
                                <h2 className="text-xl font-semibold text-green-800">{user.name}</h2>
                                <p className="text-green-600 text-sm mb-2">{user.role}</p>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                                    <span className="flex items-center justify-center sm:justify-start">
                                        <Mail className="w-4 h-4 mr-1 text-green-500" />
                                        <span className="break-all">{user.email}</span>
                                    </span>
                                    <span className="flex items-center justify-center sm:justify-start">
                                        <Phone className="w-4 h-4 mr-1 text-green-500" />
                                        {user.phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={navigateToWorkingInformation}
                            className="flex items-center justify-between p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex items-center">
                                <Users className="w-8 h-8 mr-4" />
                                <div className="text-left">
                                    <h3 className="text-xl font-semibold">Manage Tasks</h3>
                                    <p className="text-green-100">View working details</p>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => router.push('/applications')}
                            className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex items-center">
                                <FileText className="w-8 h-8 mr-4" />
                                <div className="text-left">
                                    <h3 className="text-xl font-semibold">My Applications</h3>
                                    <p className="text-purple-100">{applications?.length || 0} Applications</p>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;