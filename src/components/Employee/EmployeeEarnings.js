import React from 'react';

const EmployeeEarnings = ({ earnings }) => {
    if (!earnings) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">No earnings information available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Earnings</h2>
            <p className="text-gray-600">${earnings}</p>
        </div>
    );
};

export default EmployeeEarnings;