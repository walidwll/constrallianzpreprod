'use client'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProject } from '@/lib/store/features/contractorSlice';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddProjectForm = ({ userId }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        projectId: '',
        name: '',
        description: '',
        contractorId: userId,
        budget: '',
    });

    console.log('formData is here ', formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await dispatch(addProject(formData));
            if (addProject.fulfilled.match(result)) {
                setFormData({
                    projectId: '',
                    name: '',
                    description: '',
                    contractorId: userId,
                    budget: '',
                });
                router.push('/user/projects');
            } else {
                setError(`Error: ${result.payload}`);
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-4 sm:py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg shadow-md" role="alert">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Create New Project</h2>

                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Project ID</label>
                            <input
                                type="text"
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                                placeholder="Enter project ID"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Project Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                                placeholder="Enter project name"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] sm:min-h-[120px]"
                                required
                                placeholder="Describe your project"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Budget</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                    placeholder="Enter budget amount"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    <span className="text-sm sm:text-base">Creating Project...</span>
                                </>
                            ) : (
                                <span className="text-sm sm:text-base">Create Project</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectForm;