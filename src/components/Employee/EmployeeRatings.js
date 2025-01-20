import React from 'react';

const EmployeeRatings = ({ ratings }) => {
    if (!ratings) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">No ratings available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ratings</h2>
            <ul className="space-y-2">
                <li className="text-gray-600">Quality: {ratings.quality || 'N/A'} / 5</li>
                <li className="text-gray-600">Technical: {ratings.technical || 'N/A'} / 5</li>
                <li className="text-gray-600">Punctuality: {ratings.punctuality || 'N/A'} / 5</li>
                <li className="text-gray-600">Safety: {ratings.safety || 'N/A'} / 5</li>
                <li className="text-gray-600">Review: {ratings.review || 'N/A'}</li>
            </ul>
        </div>
    );
};

export default EmployeeRatings;