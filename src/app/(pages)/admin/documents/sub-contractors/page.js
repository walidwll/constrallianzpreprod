"use client"
import { PageLoader } from "@/components/LoadingComponent";
import { fetchAllSubCompaniesDocs } from "@/lib/store/features/subContractorSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SubContractorsDocPage = () => {
    const dispatch = useDispatch();
    const { subCompaniesDocs, loading } = useSelector(state => state.subContractor);
    const [currentPage, setCurrentPage] = useState(1);
    const [documentsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchAllSubCompaniesDocs({
            page: currentPage,
            limit: documentsPerPage,
            search: searchTerm
        }));
    }, [currentPage, documentsPerPage, dispatch]);

    const handleSearch = () => {
        setCurrentPage(1);
        dispatch(fetchAllSubCompaniesDocs({
            page: 1,
            limit: documentsPerPage,
            search: searchTerm
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (loading) {
        return (
            <PageLoader />
        );
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= subCompaniesDocs.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const renderPagination = () => {
        if (!subCompaniesDocs?.totalPages || subCompaniesDocs.totalPages <= 1) return null;

        return (
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    First
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {currentPage} of {subCompaniesDocs.totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === subCompaniesDocs.totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
                <button
                    onClick={() => handlePageChange(subCompaniesDocs.totalPages)}
                    disabled={currentPage === subCompaniesDocs.totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Last
                </button>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Subcontractor Documents</h1>

            {/* Search Input with Button */}
            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Search by company name, contractor name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Search
                </button>
            </div>

            {/* No results message */}
            {subCompaniesDocs?.documents?.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No documents found matching your search criteria.</p>
                </div>
            )}

            {/* Grid of documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subCompaniesDocs?.documents?.map((company) => (
                    <div key={company._id} className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            {company.subContractorId?.image && (
                                <img
                                    src={company?.subContractorId?.image}
                                    alt={company?.subContractorId?.name}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                            )}
                            <div>
                                <h2 className="text-xl font-semibold">{company?.name}</h2>
                                <p className="text-gray-600">{company?.subContractorId?.name}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <DocumentLink
                                label="Ownership Certificate"
                                url={company?.documents?.ownershipCertificate}
                            />
                            <DocumentLink
                                label="Agreement"
                                url={company?.documents?.agreement}
                            />
                            <DocumentLink
                                label="Obralia Registration"
                                url={company?.documents?.obraliaRegistration}
                            />
                            <DocumentLink
                                label="Privacy Document"
                                url={company?.documents?.privacyDocument}
                            />
                            <DocumentLink
                                label="Platform Regulation"
                                url={company?.documents?.platformRegulation}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {renderPagination()}
        </div>
    );
};

const DocumentLink = ({ label, url }) => {
    if (!url) return null;

    return (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-medium">{label}</span>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
            >
                View Document
            </a>
        </div>
    );
};

export default SubContractorsDocPage;