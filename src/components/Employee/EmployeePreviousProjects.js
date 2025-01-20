import React from 'react';

const PreviousProjects = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">No previous projects available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Projects</h2>
            <ul className="space-y-2">
                {projects.map((project) => (
                    <li key={project._id} className="text-gray-600">
                        <p className="font-semibold">{project.name}</p>
                        <p>{project.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PreviousProjects;