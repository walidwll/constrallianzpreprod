"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeDetails, updateEmployeeDetails } from '@/lib/store/features/employeeSlice';
import { ArrowLeft, Mail, Phone, Briefcase, DollarSign, FileText, Clock, Star, User as UserIcon, Shield, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/LoadingComponent';

const EmployeeDetails = ({ params }) => {
    const id = React.use(params).id;
    const dispatch = useDispatch();
    const router = useRouter();
    const { employee, loading } = useSelector((state) => state.employee);
    const reviewedBy = useSelector((state) => state.auth.user?.user?._id);
    const userRole = useSelector((state) => state.auth.user?.user?.role);

    const activeProject = employee?.projectDetails?.find(project => project.isActive);

    const [ratings, setRatings] = useState({
        quality: 0,
        technical: 0,
        punctuality: 0,
        safety: 0,
        review: ''
    });
    const [addHours, setAddHours] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchEmployeeDetails(id));
        }
    }, [dispatch, id]);

    const handleRatingChange = (type, value) => {
        setRatings(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await dispatch(updateEmployeeDetails({
                id: employee._id,
                data: {
                    rating: [{
                        quality: ratings.quality,
                        technical: ratings.technical,
                        punctuality: ratings.punctuality,
                        safety: ratings.safety,
                        review: ratings.review,
                        reviewedBy: reviewedBy,
                    }],
                    addHours: Number(addHours) || 0,
                }
            })).unwrap();

            if (result) {
                await dispatch(fetchEmployeeDetails(employee._id));
                setAddHours('');
                setRatings({
                    quality: 0,
                    technical: 0,
                    punctuality: 0,
                    safety: 0,
                    review: ''
                });
                toast.success('Employee details updated successfully!');
            }
        } catch (error) {
            toast.error(error?.message || 'Failed to update employee details');
            console.error('Update failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateAverageRatings = () => {
        if (!employee?.rating || employee.rating.length === 0) return null;

        const sum = employee.rating.reduce((acc, curr) => ({
            quality: acc.quality + (curr.quality || 0),
            technical: acc.technical + (curr.technical || 0),
            punctuality: acc.punctuality + (curr.punctuality || 0),
            safety: acc.safety + (curr.safety || 0)
        }), { quality: 0, technical: 0, punctuality: 0, safety: 0 });

        const count = employee.rating.length;
        return {
            quality: (sum.quality / count).toFixed(1),
            technical: (sum.technical / count).toFixed(1),
            punctuality: (sum.punctuality / count).toFixed(1),
            safety: (sum.safety / count).toFixed(1)
        };
    };

    const calculateProjectHoursAndCost = () => {
        if (!employee?.workedHoursDetails || employee.workedHoursDetails.length === 0) return [];

        const projectDetails = employee.workedHoursDetails.reduce((acc, curr) => {
            if (!acc[curr.projectId]) {
                acc[curr.projectId] = {
                    projectId: curr.projectId,
                    hourlyRate: curr.hourlyRate,
                    totalHours: 0,
                    totalCost: 0
                };
            }
            acc[curr.projectId].totalHours += curr.workedHours;
            acc[curr.projectId].totalCost += curr.workedHours * curr.hourlyRate;
            return acc;
        }, {});

        return Object.values(projectDetails);
    };

    const RatingStars = ({ rating }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                />
            ))}
            <span className="ml-1 text-sm text-gray-600">({rating})</span>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex items-center justify-center">
                <PageLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="container mx-auto max-w-6xl">
                <button
                    onClick={() => router.push("/user/dashboard")}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 space-y-6">
                    {/* Employee Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-blue-50 rounded-xl">
                        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-100">
                            <img
                                src={employee?.image}
                                alt={employee?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-grow text-center md:text-left space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-blue-800">{employee?.name}</h1>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${employee?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {employee?.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="w-4 h-4" />
                                    {employee?.email}
                                </p>
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <Phone className="w-4 h-4" />
                                    {employee?.phone}
                                </p>
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    {employee?.role}
                                </p>
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    {activeProject ? `${activeProject.hourlyRate}/hr (Project ID: ${activeProject.projectId})` : `N/A`}
                                </p>
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <Building className="w-4 h-4" />
                                    Company: {employee?.subCompanyId?.name || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Documents & Info
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <span className="text-gray-600">CV</span>
                                    <a
                                        href={employee?.cv} 
                                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        View CV
                                    </a>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="p-3 bg-white rounded-lg">
                                        <p className="text-sm text-gray-500">Created</p>
                                        <p className="text-gray-700">{formatDate(employee?.createdAt)}</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="text-gray-700">{formatDate(employee?.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Work Hours Management
                                </h2>
                                {calculateProjectHoursAndCost().map((project, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg mb-4">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                            <span className="text-gray-600">Project ID: {project.projectId}</span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                {project.totalHours} hrs
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            Hourly Rate: ${project.hourlyRate}/hr
                                        </div>
                                        <div className="mt-1 text-sm text-blue-600 font-medium">
                                            Total Cost: ${project.totalCost}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Ratings & Reviews
                        </h2>

                        {/* Average Ratings */}
                        {calculateAverageRatings() && (
                            <div className="bg-white p-4 rounded-lg mb-4">
                                <h3 className="text-lg font-semibold text-blue-700 mb-3">Average Ratings</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Quality</p>
                                        <RatingStars rating={calculateAverageRatings().quality} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Technical</p>
                                        <RatingStars rating={calculateAverageRatings().technical} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Punctuality</p>
                                        <RatingStars rating={calculateAverageRatings().punctuality} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Safety</p>
                                        <RatingStars rating={calculateAverageRatings().safety} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Individual Reviews */}
                        {Array.isArray(employee?.rating) && employee.rating.length > 0 ? (
                            <div className="space-y-3">
                                {employee.rating.map((rate, index) => (
                                    <div key={index} className="bg-white p-3 rounded-lg text-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-blue-500" />
                                                <span className="font-medium">{rate.reviewedBy?.name || 'Anonymous'}</span>
                                                <span className="text-gray-400 text-xs">
                                                    {formatDate(rate.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                                            <span className="flex items-center gap-1">
                                                Quality: {rate.quality}
                                                <Star className={`w-3 h-3 ${rate.quality > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                            </span>
                                            <span className="flex items-center gap-1">
                                                Technical: {rate.technical}
                                                <Star className={`w-3 h-3 ${rate.technical > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                            </span>
                                            <span className="flex items-center gap-1">
                                                Punctuality: {rate.punctuality}
                                                <Star className={`w-3 h-3 ${rate.punctuality > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                            </span>
                                            <span className="flex items-center gap-1">
                                                Safety: {rate.safety}
                                                <Star className={`w-3 h-3 ${rate.safety > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                            </span>
                                        </div>
                                        {rate.review && (
                                            <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded">
                                                "{rate.review}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No ratings available.</p>
                        )}
                    </div>

                    {(userRole === "production" || userRole === "supervisor") && (
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                {['quality', 'technical', 'punctuality', 'safety'].map((type) => (
                                    <div key={type} className="bg-white p-2 rounded-lg">
                                        <label className="block text-xs text-gray-700 capitalize mb-1">{type}</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <button
                                                    type="button"
                                                    key={value}
                                                    onClick={() => handleRatingChange(type, value)}
                                                    className={`p-1 rounded-full ${ratings[type] >= value
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                >
                                                    <Star className="w-4 h-4 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white p-2 rounded-lg">
                                <label className="block text-xs text-gray-700 mb-1">Review</label>
                                <textarea
                                    value={ratings.review || ''}
                                    onChange={(e) => handleRatingChange('review', e.target.value)}
                                    className="w-full p-1 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 h-24"
                                    placeholder="Add a review..."
                                />
                            </div>

                            <div className="bg-white p-2 rounded-lg">
                                <label className="block text-xs text-gray-700 mb-1">Add Hours</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={addHours}
                                    onChange={(e) => setAddHours(e.target.value)}
                                    placeholder="Enter hours"
                                    className="w-full p-1 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <input
                                type="hidden"
                                value={reviewedBy}
                            />
                            <div className='flex flex-row gap-3 justify-center flex-wrap'>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full md:w-auto px-4 py-2 ${isSubmitting
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white rounded-lg transition-colors flex items-center justify-center gap-1`}
                                >
                                    <Shield className="w-4 h-4" />
                                    {isSubmitting ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


export default EmployeeDetails;