import React from 'react';

const ProjectList = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return <div className="text-center text-gray-500">No projects available.</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-2">Projects</h2>
            <ul>
                {projects.map(project => (
                    <li key={project._id} className="border-b py-2">
                        <h3 className="text-xl font-semibold">{project.name}</h3>
                        <p><strong>Description:</strong> {project.description}</p>
                        <p><strong>Budget:</strong> {project.budget}</p>
                        <p><strong>Total Hours:</strong> {project.totalHours}</p>
                        <p><strong>Total Cost:</strong> {project.totalCost}</p>
                        <p><strong>Completed:</strong> {project.isCompleted ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;