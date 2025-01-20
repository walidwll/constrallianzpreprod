import React from 'react';

const EmployeeProfile = ({ user }) => {
    if (!user) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 text-center">No profile information available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <img src={user.image || '/default-profile.png'} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 text-center">{user.name}</h2>
            <p className="text-gray-600 text-center">{user.email}</p>
            <p className="text-gray-600 text-center">{user.phone}</p>
            <p className="text-gray-600 text-center">Role: {user.role}</p>
            <p className="text-gray-600 text-center">Sub-Contractor: {user.subCompanyId?.name || 'N/A'}</p>
        </div>
    );
};

export default EmployeeProfile;