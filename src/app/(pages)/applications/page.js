"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchEmployeeApplications, createNewApplication, resetApplicationState } from '@/lib/store/features/employeeSlice';
import { fetchAllSubCompanies } from '@/lib/store/features/subContractorSlice';
import SearchableDropdown from '@/components/Custom/Dropdown';
import Link from 'next/link';
import { PageLoader } from '@/components/LoadingComponent';

const ApplicationsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user?.user);
    const { applications, loading, error, applicationSuccess } = useSelector((state) => state.employee);
    const subCompanies = useSelector((state) => state.subContractor.subCompanies);
    const applicationState = useSelector((state) => state.application) || { loading: false, error: null };
    const [selectedCompany, setSelectedCompany] = useState('');
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchEmployeeApplications(user?._id));
            dispatch(fetchAllSubCompanies());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (applicationSuccess) {
            dispatch(fetchEmployeeApplications(user?._id));
            setShowApplicationForm(false);
            setSelectedCompany('');
            dispatch(resetApplicationState());
        }
    }, [applicationSuccess, dispatch, user?._id]);

    const handleNewApplication = async () => {
        if (selectedCompany) {
            await dispatch(createNewApplication({
                employeeId: user._id,
                subCompanyId: selectedCompany
            }));
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canApplyNewCompany = () => {
        if (loading || !applications) return false;
        if (applications.length === 0) return true;
        const latestApplication = [...applications].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        return latestApplication.status === 'rejected';
    };

    if (loading) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    const renderNewApplicationForm = () => (
        <div className="bg-white border-2 border-green-100 rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">Apply to New Company</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Company
                    </label>
                    <SearchableDropdown
                        options={subCompanies}
                        value={selectedCompany}
                        onChange={setSelectedCompany}
                        placeholder="Select a company"
                        searchPlaceholder="Search companies..."
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowApplicationForm(false)}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleNewApplication}
                        disabled={!selectedCompany || applicationState.loading}
                        className={`px-4 py-2 text-sm rounded-lg text-white ${!selectedCompany || applicationState.loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {applicationState.loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
                {applicationState.error && (
                    <p className="text-red-600 text-sm mt-2">{applicationState.error}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-2 sm:p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6">
                    {/* Header Section */}
                    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center gap-3">
                        <Link href="/user/dashboard" className="flex items-center text-green-600 hover:text-green-700">
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Back
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center flex-1 text-green-800">My Applications</h1>
                    </div>
                    {!loading && !showApplicationForm && canApplyNewCompany() && (
                        <button
                            onClick={() => setShowApplicationForm(true)}
                            className="mb-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Apply to New Company
                        </button>
                    )}

                    {!loading && !canApplyNewCompany() && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                            You can only apply to a new company after your current application is rejected.
                        </div>
                    )}
                    {/* New Application Form */}
                    {showApplicationForm && renderNewApplicationForm()}

                    <div className="space-y-4 sm:space-y-6">
                        {!loading && (!applications || applications.length === 0) ? (
                            <div className="text-center py-8 sm:py-12 bg-blue-50 rounded-xl">
                                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
                                <p className="text-lg sm:text-xl text-green-600">No applications yet</p>
                                <p className="text-sm sm:text-base text-green-400">Your job applications will appear here</p>
                            </div>
                        ) : (
                            applications?.map((application) => (
                                <div key={application._id} className="bg-white border-2 border-green-100 rounded-xl shadow-md p-3 sm:p-6">
                                    {/* Status Badge */}
                                    <div className="flex justify-end mb-3 sm:mb-4">
                                        <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center
                                            ${application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Profile Section */}
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:space-x-6 mb-4 sm:mb-6">
                                        <img src={application.employeeId.image}
                                            alt={application.employeeId.name}
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover" />
                                        <div className="text-center sm:text-left">
                                            <h3 className="text-xl sm:text-2xl font-bold text-green-800">{application.employeeId.name}</h3>
                                            <p className="text-sm sm:text-base text-gray-600">{application.employeeId.email}</p>
                                            <p className="text-sm sm:text-base text-gray-600">Phone: {application.employeeId.phone}</p>
                                            <p className="text-sm sm:text-base text-green-600 font-semibold">Rate: ${application.employeeId.hourlyRate}/hr</p>
                                        </div>
                                    </div>

                                    {/* Sub-Contractor Details */}
                                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                                        <h4 className="text-md sm:text-lg font-semibold text-green-800 mb-2">Sub-Contractor Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                            <div>
                                                <p className="text-sm sm:text-base text-gray-600">Name: {application.subContractorId[0]?.name}</p>
                                                <p className="text-sm sm:text-base text-gray-600">Email: {application.subContractorId[0]?.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm sm:text-base text-gray-600">Phone: {application.subContractorId[0]?.phone}</p>
                                                <p className="text-sm sm:text-base text-gray-600">Role: {application.subContractorId[0]?.role}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3 pt-3 border-t">
                                        <div className="text-xs sm:text-sm">
                                            <p className="text-gray-600">Created: {formatDate(application.createdAt)}</p>
                                            <p className="text-gray-600">Last Updated: {formatDate(application.updatedAt)}</p>
                                        </div>
                                        <a href={application.employeeId.cv}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto text-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base">
                                            View CV
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsPage;