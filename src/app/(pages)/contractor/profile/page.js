'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import ContractorProfile from '@/components/Contractor/ContractorProfile';

const ContractorProfilePage = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h1 className="text-3xl font-bold text-green-800 mb-8">Contractor Profile</h1>
                    <ContractorProfile user={user} />
                </div>
            </div>
        </div>
    );
};

export default ContractorProfilePage;