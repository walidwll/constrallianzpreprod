'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDocuments, updateAdminDocuments } from '@/lib/store/features/subContractorSlice';

const DocumentPage = () => {
    const dispatch = useDispatch();
    const fileRefs = {
        agreement: useRef(),
        privacyDocument: useRef(),
        platformRegulation: useRef(),
    };
    const [uploadingDoc, setUploadingDoc] = useState(null);

    const { adminDocuments, adminDocumentsError } = useSelector(
        (state) => state.subContractor
    );

    useEffect(() => {
        dispatch(fetchAdminDocuments());
    }, [dispatch]);

    const handleFileSelect = (docName) => {
        fileRefs[docName].current.click();
    };

    const handleFileUpload = async (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only PDF and Word documents are allowed');
                e.target.value = '';
                return;
            }
            setUploadingDoc(docName);
            const formData = new FormData();
            formData.append(docName, file);
            await dispatch(updateAdminDocuments(formData));
            setUploadingDoc(null);
            e.target.value = '';
        }
    };

    const formatDocName = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Documents Management</h1>

            {adminDocumentsError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {adminDocumentsError}
                </div>
            )}

            <div className="space-y-6">
                {['agreement', 'privacyDocument', 'platformRegulation'].map((doc) => (
                    <div key={doc} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{formatDocName(doc)}</h2>
                            {adminDocuments?.[doc] && (
                                <a
                                    href={adminDocuments[doc]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <span className="mr-2">View Current</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileRefs[doc]}
                            className="hidden"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => handleFileUpload(e, doc)}
                        />

                        <button
                            onClick={() => handleFileSelect(doc)}
                            disabled={uploadingDoc === doc}
                            className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
                                ${uploadingDoc === doc
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            {uploadingDoc === doc ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Upload {formatDocName(doc)}
                                </span>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentPage;