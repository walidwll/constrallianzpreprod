'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubContractorDocuments } from '@/lib/store/features/contractorSlice';

const SubContractorDocumentsPage = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const contractorId = useSelector(state => state.auth?.user?.user?._id);
    const { data: documents, pagination, loading } = useSelector(state => state.contractor.subContractorDocuments);

    // Handle search debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch documents when search or page changes
    useEffect(() => {
        if (contractorId) {
            dispatch(fetchSubContractorDocuments({
                contractorId,
                page: 1, // Reset to first page on new search
                limit: 10,
                search: debouncedSearch
            }));
        }
    }, [contractorId, debouncedSearch, dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchSubContractorDocuments({
            contractorId,
            page,
            limit: 10,
            search: debouncedSearch
        }));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Reset pagination when searching
        if (pagination.currentPage !== 1) {
            dispatch(fetchSubContractorDocuments({
                contractorId,
                page: 1,
                limit: 10,
                search: e.target.value
            }));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Sub Contractor Documents</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by subcontractor name or email..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : documents?.length === 0 ? (
                <div className="text-center py-10">
                    <div className="text-gray-500 text-lg">
                        {searchTerm 
                            ? "No subcontractors found matching your search criteria"
                            : "No subcontractors found in your projects"}
                    </div>
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-blue-600 hover:text-blue-800"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sub Contractor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Agreement
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Obralia Registration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ownership Certificate
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {documents?.map((doc) => (
                                    <tr key={doc._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{doc.subContractorId?.name}</p>
                                                <p className="text-sm text-gray-500">{doc?.subContractorId?.email}</p>
                                                <p className="text-sm text-gray-500">{doc?.subContractorId?.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewDocument(doc?.documents?.agreement)}
                                                disabled={!doc.documents?.agreement}
                                                className={`px-4 py-2 rounded-md text-sm font-medium ${doc?.documents?.agreement
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                View Agreement
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewDocument(doc?.documents?.obraliaRegistration)}
                                                disabled={!doc?.documents?.obraliaRegistration}
                                                className={`px-4 py-2 rounded-md text-sm font-medium ${doc?.documents?.obraliaRegistration
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                View Registration
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewDocument(doc?.documents?.ownershipCertificate)}
                                                disabled={!doc.documents?.ownershipCertificate}
                                                className={`px-4 py-2 rounded-md text-sm font-medium ${doc.documents?.ownershipCertificate
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                View Certificate
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center space-x-2 mt-4">
                            {[...Array(pagination.totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-3 py-1 rounded-md text-sm ${pagination.currentPage === index + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SubContractorDocumentsPage;