"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyDetails } from '@/lib/store/features/subContractorSlice';
import { useRouter } from 'next/navigation';
import {
    Building2,
    Users,
    Mail,
    Phone,
    Search,
    Eye,
    MapPin,
    ArrowLeft,
    Hash
} from 'lucide-react';
import { PageLoader } from '@/components/LoadingComponent';

const CompanyDetails = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.auth?.user?.user);
    const router = useRouter();
    const { companyDetails, loading, error } = useSelector((state) => state.subContractor);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            dispatch(fetchCompanyDetails(user._id));
        }
    }, [dispatch, user]);

    const filteredEmployees = companyDetails?.employeesId?.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
           <PageLoader/>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="container mx-auto">
                <button
                    onClick={() => router.push('/user/dashbaord')}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
                    {/* Company Profile Section */}
                    <div className="mb-8 bg-blue-50 rounded-xl p-4 md:p-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                            <div className="p-4 bg-blue-600 rounded-xl text-white">
                                <Building2 className="w-12 h-12 md:w-16 md:h-16" />
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">{companyDetails?.name}</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    <p className="flex items-center justify-center md:justify-start text-gray-600">
                                        <Hash className="w-4 h-4 mr-2 text-blue-500" />
                                        {companyDetails?._id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Employees Section */}
                    <div className="mt-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold text-blue-800 flex items-center">
                                <Users className="mr-3 text-blue-600" />
                                Employees ({filteredEmployees?.length || 0})
                            </h2>
                            <div className="w-full md:w-auto relative">
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-80 px-4 py-2 pl-10 rounded-lg border border-blue-200 focus:outline-none focus:border-blue-500"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredEmployees?.map((employee) => (
                                <div
                                    key={employee._id}
                                    className="bg-white border-2 border-blue-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-4"
                                >
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                                        {/* Profile Image */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            {employee.image ? (
                                                <img
                                                    src={employee.image}
                                                    alt={employee.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                                            )}
                                        </div>

                                        {/* Employee Details */}
                                        <div className="flex-grow text-center sm:text-left w-full">
                                            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-1 sm:mb-2 truncate">
                                                {employee.name}
                                            </h3>

                                            {/* Email with truncation */}
                                            <div className="text-gray-600 flex items-center justify-center sm:justify-start mb-2">
                                                <Mail className="w-4 h-4 min-w-[16px] text-blue-500 mr-2" />
                                                <span className="truncate max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
                                                    {employee.email}
                                                </span>
                                            </div>

                                            {/* View Details Button */}
                                            <button
                                                onClick={() => router.push(`/employee/${employee._id}`)}
                                                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View Details</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* No Results Message */}
                            {(!filteredEmployees?.length) && (
                                <div className="col-span-full text-center py-6 sm:py-8 bg-blue-50 rounded-xl">
                                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-3 sm:mb-4" />
                                    <p className="text-lg sm:text-xl text-blue-600">No employees found</p>
                                    <p className="text-sm sm:text-base text-blue-400">Try adjusting your search criteria</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;