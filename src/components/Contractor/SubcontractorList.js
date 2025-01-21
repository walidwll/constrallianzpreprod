import React, { useState } from 'react';

const SubcontractorList = ({ subcontractors, loading, error }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const subcontractorsPerPage = 10;

    // Pagination logic
    const indexOfLastSubcontractor = currentPage * subcontractorsPerPage;
    const indexOfFirstSubcontractor = indexOfLastSubcontractor - subcontractorsPerPage;
    const currentSubcontractors = subcontractors?.subcontractors?.slice(indexOfFirstSubcontractor, indexOfLastSubcontractor) || [];
    const totalPages = Math.ceil((subcontractors?.subcontractors?.length || 0) / subcontractorsPerPage);

    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Subcontractors</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSubcontractors.map((subcontractor) => (
                                <tr key={subcontractor._id} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-6">{subcontractor.name}</td>
                                    <td className="py-3 px-6">{subcontractor.email}</td>
                                    <td className="py-3 px-6">{subcontractor.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className="mt-4 flex justify-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SubcontractorList;