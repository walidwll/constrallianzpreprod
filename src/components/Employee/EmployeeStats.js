import React from 'react';

const EmployeeStats = ({ user }) => {
    if (!user) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">No stats available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Stats</h2>
            <ul className="space-y-2">
                <li className="text-gray-600">Hourly Rate: ${user.hourlyRate || 'N/A'}</li>
                <li className="text-gray-600">Worked Hours: {user.workedHour || 'N/A'}</li>
                <li className="text-gray-600">CV: {user.cv ? <a href={user.cv} target="_blank" className="text-blue-500 underline">Download</a> : 'N/A'}</li>
                <li className="text-gray-600">Active: {user.isActive ? 'Yes' : 'No'}</li>
            </ul>
        </div>
    );
};

export default EmployeeStats;