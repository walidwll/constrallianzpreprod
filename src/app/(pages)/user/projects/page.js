'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchProjectsByUserId, setCurrentProjectsPage, setOldProjectsPage } from '@/lib/store/features/contractorSlice';
import { Building2, Users, UserCircle, DollarSign, Clock, Calendar, ChevronRight } from 'lucide-react';
import { PageLoader } from '@/components/LoadingComponent';

const ProjectCard = ({ project, onClick }) => (
    <div
        className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
        onClick={onClick}
    >
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {project.name}
                    </h3>
                    <span className="inline-block mt-2 text-sm">
                        <Clock className="w-4 h-4 inline mr-1 text-gray-400" />
                        {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                    }`}>
                    {project.isCompleted ? 'Completed' : 'In Progress'}
                </span>
            </div>

            <p className="text-gray-600 mb-6 line-clamp-2">{project.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-gray-600 mb-1">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-sm font-medium">Budget</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">${project.budget}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-gray-600 mb-1">
                        <Users className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="text-sm font-medium">Team</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                        {project?.employeesId?.length} Members
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium">{project?.companyId?.name}</span>
                </div>

                <button
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/user/projects/${project?._id}`;
                    }}
                >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    </div>
);

const ProjectSection = ({ title, projects, onProjectClick, currentPage, totalPages, onPageChange }) => (
    <>
        {projects?.length > 0 && (
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                        {projects.length} Projects
                    </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onClick={() => onProjectClick(project?._id)}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 mx-1">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        )}
    </>
);

const ProjectsPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const currentProjects = useSelector((state) => state.contractor.currentProjects);
    const oldProjects = useSelector((state) => state.contractor.oldProjects);
    const loading = useSelector((state) => state.contractor.loading);
    const userId = useSelector((state) => state.auth.user?.user?._id);
    const currentProjectsPage = useSelector((state) => state.contractor.currentProjectsPage);
    const currentProjectsTotalPages = useSelector((state) => state.contractor.currentProjectsTotalPages);
    const oldProjectsPage = useSelector((state) => state.contractor.oldProjectsPage);
    const oldProjectsTotalPages = useSelector((state) => state.contractor.oldProjectsTotalPages);

    useEffect(() => {
        if (userId) {
            dispatch(
                fetchProjectsByUserId({
                    userId,
                    isCompleted: 'false',
                    page: currentProjectsPage,
                    pageSize: 6,
                })
            );
        }
    }, [dispatch, userId, currentProjectsPage]);

    useEffect(() => {
        if (userId) {
            dispatch(
                fetchProjectsByUserId({
                    userId,
                    isCompleted: 'true',
                    page: oldProjectsPage,
                    pageSize: 6,
                })
            );
        }
    }, [dispatch, userId, oldProjectsPage]);

    const handleProjectClick = (projectId) => {
        router.push(`/user/projects/${projectId}`);
    };

    const handleCurrentPageChange = (newPage) => {
        dispatch(setCurrentProjectsPage(newPage));
    };

    const handleOldPageChange = (newPage) => {
        dispatch(setOldProjectsPage(newPage));
    };

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <main className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transform hover:shadow-2xl transition-all">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Projects Overview</h1>
                    <p className="text-gray-600">
                        Manage and monitor all your current and past projects
                    </p>
                </div>

                {(!currentProjects?.length && !oldProjects?.length) ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
                        <p className="text-gray-600">Start by creating your first project</p>
                    </div>
                ) : (
                    <>
                        {currentProjects?.length > 0 && (
                            <ProjectSection
                                title="Current Projects"
                                projects={currentProjects}
                                onProjectClick={handleProjectClick}
                                currentPage={currentProjectsPage}
                                totalPages={currentProjectsTotalPages}
                                onPageChange={handleCurrentPageChange}
                            />
                        )}
                        {oldProjects?.length > 0 && (
                            <ProjectSection
                                title="Completed Projects"
                                projects={oldProjects}
                                onProjectClick={handleProjectClick}
                                currentPage={oldProjectsPage}
                                totalPages={oldProjectsTotalPages}
                                onPageChange={handleOldPageChange}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ProjectsPage;