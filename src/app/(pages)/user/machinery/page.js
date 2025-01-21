'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachinery, addMachinery, deleteMachinery, fetchProjects } from '@/lib/store/features/subContractorSlice';
import { PlusCircle, Pencil, Trash } from 'lucide-react';
import { Modal, Box, Typography, Button } from '@mui/material';

export default function MachineryPage() {
    const dispatch = useDispatch();

    const subcontractorId = useSelector(state => state.auth.user?.user._id);
    const { machinery, totalMachinery, loading, error } = useSelector(state => state.subContractor);

    const predefinedCategories = [
        "Hand Tools",
        "Power Tools",
        "Measuring Tools",
        "Cutting Tools",
        "Lifting Tools",
        "Earthmoving Tools",
        "Concrete Tools",
        "Safety Gear",
        "Plumbing Tools",
        "Electrical Tools",
        "Painting Tools",
        "Demolition Tools",
        "Scaffolding Tools",
        "Surveying Tools",
        "Finishing Tools",
        "Paving Tools",
        "Welding Tools",
        "Gardening Tools",
        "Other"
    ];
    console.log(subcontractorId,"subcontractorId"
    )

    const [form, setForm] = useState({
        name: '',
        category: '',
        model: '',
        type: '',
        hourlyRate: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setForm({
            name: '',
            category: '',
            model: '',
            type: '',
            hourlyRate: '',
            projectId: ''
        });
    };

    useEffect(() => {
        if (subcontractorId) {
            dispatch(fetchMachinery({
                page: currentPage,
                limit: 10,
                search: searchQuery,
                subcontractorId: subcontractorId
            }));
            dispatch(fetchProjects({ subcontractorId }))
        }
    }, [dispatch, currentPage, searchQuery, subcontractorId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        if (!form.name || !form.category || !form.model || !form.type || !form.hourlyRate) {
            setIsValidationModalOpen(true);
            return;
        }

        const payload = {
            ...form,
            subcontractorId: subcontractorId
        };

        dispatch(addMachinery({ ...payload }));
        closeModal();
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        dispatch(deleteMachinery(deleteId));
        setIsDeleteModalOpen(false);
        setDeleteId(null);
    };

    const totalPages = Math.ceil(totalMachinery / 10);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        dispatch(fetchMachinery({
            page: 1,
            limit: 10,
            search: searchQuery,
            subcontractorId
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800">Machinery</h1>
                        <p className="mt-2 text-lg text-gray-600">Manage your machinery efficiently.</p>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Add Machinery
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <form onSubmit={handleSearch} className="w-full md:w-1/3 flex mb-4 md:mb-0">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Machinery"
                            className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                            Search
                        </button>
                    </form>
                </div>

                {/* Machinery Table */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Category</th>
                                    <th className="px-6 py-3 text-left">Model</th>
                                    <th className="px-6 py-3 text-left">Type</th>
                                    <th className="px-6 py-3 text-left">Project</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {machinery.map(m => (
                                    <tr key={m._id}>
                                        <td className="px-6 py-4">{m.name}</td>
                                        <td className="px-6 py-4">{m.category}</td>
                                        <td className="px-6 py-4">{m.model}</td>
                                        <td className="px-6 py-4">{m.type}</td>
                                        <td className="px-6 py-4">{m.projectId ? m.projectId.name : 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full ${m.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {m.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(m._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center items-center mb-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 border rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed mr-2 ${currentPage === 1 ? 'cursor-not-allowed' : ''
                            }`}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 border rounded-md bg-white">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`px-4 py-2 border rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed ml-2 ${currentPage === totalPages || totalPages === 0 ? 'cursor-not-allowed' : ''
                            }`}
                    >
                        Next
                    </button>
                </div>

                {/* Add Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
                        <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative sm:max-w-lg sm:m-4 md:max-w-xl lg:max-w-2xl h-auto max-h-screen overflow-y-auto">
                            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
                                &times;
                            </button>
                            <h2 className="text-xl font-semibold mb-4">Add Machinery</h2>
                            <form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        required
                                    />
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
                                            required
                                        >
                                            <option value="" disabled className="text-gray-500">
                                                Select Category
                                            </option>
                                            {predefinedCategories.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                    className="py-2"
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        name="model"
                                        value={form.model}
                                        onChange={handleChange}
                                        placeholder="Model"
                                        className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="hourlyRate"
                                        value={form.hourlyRate}
                                        onChange={handleChange}
                                        placeholder="Hourly Rate (in $)"
                                        className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        placeholder="Type"
                                        className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        required
                                    />
                                </div>
                                <div className="mt-6 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <Modal
                    open={isValidationModalOpen}
                    onClose={() => setIsValidationModalOpen(false)}
                    aria-labelledby="validation-modal-title"
                    aria-describedby="validation-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                        <Typography id="validation-modal-title" variant="h6" component="h2">
                            Form Validation
                        </Typography>
                        <Typography id="validation-modal-description" sx={{ mt: 2 }}>
                            Please fill all required fields.
                        </Typography>
                        <Button onClick={() => setIsValidationModalOpen(false)} sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Box>
                </Modal>

                <Modal
                    open={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    aria-labelledby="delete-modal-title"
                    aria-describedby="delete-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                        <Typography id="delete-modal-title" variant="h6" component="h2">
                            Confirm Deletion
                        </Typography>
                        <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                            Are you sure you want to deactivate this machinery?
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button onClick={() => setIsDeleteModalOpen(false)} variant="contained" color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={confirmDelete} variant="contained" color="error">
                                Confirm
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </div>
        </div>
    );
}
