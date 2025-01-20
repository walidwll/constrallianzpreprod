"use client";
import React, { useEffect, useState } from 'react';
import { addEmployeeToProject, fetchEmployees } from '@/lib/store/features/subContractorSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
    Search,
    Filter, 
    Star,
    User,
    DollarSign,
    Clock,
    Mail,
    Phone,
    Check,
    X
} from 'lucide-react';
import { useParams } from 'next/navigation';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    useMediaQuery,
    useTheme
} from '@mui/material';
import toast from 'react-hot-toast';

const ConfirmModal = ({ open, employee, onClose, onConfirm, loading }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-dialog-title"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    padding: 1,
                    minWidth: { xs: '90%', sm: '400px' }
                }
            }}
        >
            <DialogTitle id="confirm-dialog-title">
                Confirm Addition
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to create a request to add {employee?.name} to this project?                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="primary"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ ml: 2 }}
                >
                    {loading ? (
                        <>
                            <span className="animate-spin mr-2">⚪</span>
                            Requesting...
                        </>
                    ) : 'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const StatusBadge = ({ isActive }) => (
    <span className={`px-2 py-1 text-xs rounded-full ${isActive
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
        {isActive ? 'Active' : 'Inactive'}
    </span>
);

const AddEmployee = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.auth?.user?.user);
    const params = useParams();
    const { projectid } = params;
    const { employees, loading: empLoading, error: empError, totalPages, currentPage } = useSelector(
        (state) => state?.subContractor
    );

    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        quality: '',
        technical: '',
        punctuality: '',
        safety: '',
        isActive: '',
        minWorkedHours: '',
    });

    const [loadingEmployees, setLoadingEmployees] = useState({});
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        employeeId: null,
        employeeName: ''
    });
    const [page, setPage] = useState(1);
    const limit = 10;

    const SearchInput = () => (
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 p-2 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                Press Enter to search
            </div>
        </div>
    )

    useEffect(() => {
        const fetchData = setTimeout(() => {
            if (user?._id) {
                dispatch(fetchEmployees({
                    filters: {
                        name: searchTerm,
                        isActive: filters.isActive || '',
                        minWorkedHours: filters.minWorkedHours || '',
                        quality: filters.quality || '',
                        technical: filters.technical || '',
                        punctuality: filters.punctuality || '',
                        safety: filters.safety || '',
                    },
                    userRole: user?.role,
                    subContractorId: user._id,
                    page,
                    limit
                }));
            }
        }, 300);

        return () => clearTimeout(fetchData);
    }, [dispatch, user?.role, user?._id, filters, searchTerm, page]);

    const handleAddEmployee = (employeeId) => async () => {
        try {
            setLoadingEmployees(prev => ({ ...prev, [employeeId]: true }));
            await dispatch(addEmployeeToProject({ employeeId: employeeId, projectId: projectid })).unwrap();
            toast.success('Request sent successfully!');
        } catch (error) {
            console.error('Failed to add employee:', error);
        } finally {
            setLoadingEmployees(prev => ({ ...prev, [employeeId]: false }));
            setConfirmModal({ show: false, employeeId: null, employeeName: '' });
        }
    };

    const showConfirmation = (employeeId, employeeName) => {
        setConfirmModal({
            show: true,
            employeeId,
            employeeName
        });
    };

    useEffect(() => {
        if (employees) {
            setFilteredEmployees(employees);
        }
    }, [employees]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const resetFilters = () => {
        setFilters({
            quality: '',
            technical: '',
            punctuality: '',
            safety: '',
            isActive: '',
            minWorkedHours: '',
        });
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
                        <User className="mr-3 text-blue-600" /> Employees
                    </h2>

                    <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                        <SearchInput />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Quality Rating */}
                            <div>
                                <label className="block text-blue-700 mb-2">
                                    <Star className="inline-block mr-2 text-yellow-500" />
                                    Quality Rating
                                </label>
                                <select
                                    name="quality"
                                    value={filters.quality}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border-2 border-blue-200 rounded-lg"
                                >
                                    <option value="">All</option>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <option key={rating} value={rating}>{rating}+ Stars</option>
                                    ))}
                                </select>
                            </div>

                            {/* Technical Rating */}
                            <div>
                                <label className="block text-blue-700 mb-2">
                                    <Star className="inline-block mr-2 text-blue-500" />
                                    Technical Rating
                                </label>
                                <select
                                    name="technical"
                                    value={filters.technical}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border-2 border-blue-200 rounded-lg"
                                >
                                    <option value="">All</option>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <option key={rating} value={rating}>{rating}+ Stars</option>
                                    ))}
                                </select>
                            </div>

                            {/* Punctuality Rating */}
                            <div>
                                <label className="block text-blue-700 mb-2">
                                    <Star className="inline-block mr-2 text-green-500" />
                                    Punctuality Rating
                                </label>
                                <select
                                    name="punctuality"
                                    value={filters.punctuality}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border-2 border-blue-200 rounded-lg"
                                >
                                    <option value="">All</option>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <option key={rating} value={rating}>{rating}+ Stars</option>
                                    ))}
                                </select>
                            </div>

                            {/* Safety Rating */}
                            <div>
                                <label className="block text-blue-700 mb-2">
                                    <Star className="inline-block mr-2 text-red-500" />
                                    Safety Rating
                                </label>
                                <select
                                    name="safety"
                                    value={filters.safety}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border-2 border-blue-200 rounded-lg"
                                >
                                    <option value="">All</option>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <option key={rating} value={rating}>{rating}+ Stars</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-blue-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="isActive"
                                    value={filters.isActive}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border-2 border-blue-200 rounded-lg"
                                >
                                    <option value="">All Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-blue-700 mb-2">
                                    <Clock className="inline-block mr-2 text-purple-500" />
                                    Minimum Worked Hours
                                </label>
                                <input
                                    min="0"
                                    type="number"
                                    name="minWorkedHours"
                                    placeholder="Min Hours"
                                    value={filters.minWorkedHours}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border-2 border-blue-200 rounded-lg"
                                />
                            </div>

                            {/* Reset Filters Button */}
                            <div className="flex items-end">
                                <button
                                    onClick={resetFilters}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {empLoading ? (
                        <div className="text-center text-blue-600 py-4">
                            Loading employees...
                        </div>
                    ) : (
                        <>
                            {empError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    Error: {empError}
                                </div>
                            )}

                            {/* Employee List */}
                            <div className="space-y-6">
                                {filteredEmployees && filteredEmployees.map((employee) => (
                                    <div
                                        key={employee._id}
                                        className="bg-white border-2 border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 w-full"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                                                <div className="flex flex-col items-center mb-4 md:mb-0">
                                                    <img
                                                        src={employee.image}
                                                        alt={employee.name}
                                                        className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover mb-4"
                                                    />
                                                    <h2 className="text-xl font-bold text-blue-800 mb-2">{employee.name}</h2>
                                                    <StatusBadge isActive={employee.isActive} />
                                                    <p className="text-blue-600 mt-2">{employee.role}</p>
                                                </div>

                                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <p className="flex items-center">
                                                            <Mail className="mr-2 text-blue-500" /> {employee.email}
                                                        </p>
                                                        <p className="flex items-center">
                                                            <Phone className="mr-2 text-green-500" /> {employee.phone}
                                                        </p>
                                                        <p className="flex items-center">
                                                            <DollarSign className="mr-2 text-green-600" />
                                                            Hourly Rate: ${employee.hourlyRate}
                                                        </p>

                                                    </div>

                                                    <div className="bg-blue-50 p-4 rounded-lg h-full">
                                                        <h3 className="text-blue-700 font-semibold mb-2">Performance Ratings</h3>

                                                        {employee.rating && employee.rating.length > 0 ? (
                                                            <>
                                                                {/* Average Rating */}
                                                                <div className="mb-4">
                                                                    <p className="text-lg font-semibold text-blue-800">
                                                                        Average Rating: {
                                                                            (employee.rating.reduce((acc, r) => {
                                                                                const sum = (r.quality || 0) +
                                                                                    (r.technical || 0) +
                                                                                    (r.punctuality || 0) +
                                                                                    (r.safety || 0);
                                                                                return acc + (sum / 4);
                                                                            }, 0) / employee.rating.length).toFixed(1)
                                                                        } / 5
                                                                    </p>
                                                                </div>

                                                                {/* Reviews List */}
                                                                <div className="space-y-3 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                                                                    {employee.rating.map((review, index) => (
                                                                        <div
                                                                            key={review._id || index}
                                                                            className="border border-blue-100 rounded-lg p-3 bg-white shadow-sm"
                                                                        >
                                                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                                                <div>
                                                                                    <p className="text-sm text-gray-600">
                                                                                        <span className="font-medium">Quality:</span> {review.quality || 0}/5
                                                                                    </p>
                                                                                    <p className="text-sm text-gray-600">
                                                                                        <span className="font-medium">Technical:</span> {review.technical || 0}/5
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm text-gray-600">
                                                                                        <span className="font-medium">Punctuality:</span> {review.punctuality || 0}/5
                                                                                    </p>
                                                                                    <p className="text-sm text-gray-600">
                                                                                        <span className="font-medium">Safety:</span> {review.safety || 0}/5
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            {review.review && (
                                                                                <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                                                                                    "{review.review}"
                                                                                </p>
                                                                            )}
                                                                            <p className="text-xs text-gray-500 mt-2">
                                                                                Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center h-[200px] text-center">
                                                                <Star className="text-gray-400 mb-2 h-8 w-8" />
                                                                <p className="text-gray-500">No reviews yet</p>
                                                                <p className="text-sm text-gray-400">This employee hasn't received any performance ratings</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center mt-4 md:mt-0">
                                                    <button
                                                        onClick={() => showConfirmation(employee._id, employee.name)}
                                                        disabled={loadingEmployees[employee._id] || !employee.isActive}
                                                        className={`px-6 py-2 rounded-lg transition whitespace-nowrap ${!employee.isActive
                                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                            : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300'
                                                            }`}
                                                    >
                                                        {loadingEmployees[employee._id] ? (
                                                            <span className="flex items-center">
                                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Adding...
                                                            </span>
                                                        ) : 'Add to Project'}
                                                    </button>
                                                    {!employee.isActive && (
                                                        <p className="text-xs text-red-500 mt-2 text-center">
                                                            Cannot add inactive employee
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* No Results State */}
                            {filteredEmployees && filteredEmployees.length === 0 && (
                                <div className="text-center py-8 bg-blue-50 rounded-lg">
                                    <p className="text-blue-600 text-xl">No employees match your filters.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            )}

            <ConfirmModal
                open={confirmModal.show}
                employee={{ name: confirmModal.employeeName }}
                onClose={() => setConfirmModal({ show: false, employeeId: null, employeeName: '' })}
                onConfirm={handleAddEmployee(confirmModal.employeeId)}
                loading={loadingEmployees[confirmModal.employeeId]}
            />
        </div>
    );
};

export default AddEmployee;