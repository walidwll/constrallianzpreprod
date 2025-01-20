import React from 'react';

const ContractorProfile = ({ user }) => {
    if (!user) {
        return <div className="text-center text-gray-500">No user details available.</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-2xl font-bold mb-2">Contractor Details</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p className='capitalize'><strong>Role:</strong> {user.role}</p>
        </div>
    );
};

export default ContractorProfile;