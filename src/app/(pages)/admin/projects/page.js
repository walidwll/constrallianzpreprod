'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchProjects, setCurrentPage } from '@/lib/store/features/contractorSlice';
import { Building2, Users, UserCircle, DollarSign, Clock, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
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
                        {project.employeesId.length} Members
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
                        window.location.href = `/admin/projects/${project._id}`;
                    }}
                >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    </div>
);

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 rounded bg-white border border-gray-300 
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex flex-wrap gap-1">
                {getPageNumbers().map((pageNum, idx) => (
                    <button
                        key={idx}
                        onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                        className={`px-3 py-1 rounded min-w-[2.5rem] ${pageNum === currentPage
                            ? 'bg-blue-600 text-white'
                            : pageNum === '...'
                                ? 'cursor-default'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-1 rounded bg-white border border-gray-300 
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );
};

const ProjectSection = ({ title, projects, onProjectClick, currentPage, onPageChange }) => {
    const projectsPerPage = 3;
    const totalPages = Math.ceil((projects?.length || 0) / projectsPerPage);

    const paginatedProjects = projects?.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
    );

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                    {projects?.length || 0} Projects
                </span>
            </div>
            {!projects?.length ? (
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <Users className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">No {title}</h3>
                    <p className="text-gray-600 text-sm">No projects found in this category</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedProjects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onClick={() => onProjectClick(project._id)}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

const ProjectsPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const projects = useSelector((state) => state.contractor.projects);
    const loading = useSelector((state) => state.contractor.loading);
    const error = useSelector((state) => state.contractor.error);
    const currentPage = useSelector((state) => state.contractor.currentPage);
    const totalPages = useSelector((state) => state.contractor.totalPages);
    const projectsPerPage = useSelector((state) => state.contractor.projectsPerPage);

    const [isCompleted, setIsCompleted] = React.useState(false);
    useEffect(() => {
        dispatch(fetchProjects({ isCompleted, page: currentPage, pageSize: projectsPerPage }));
    }, [dispatch, isCompleted, currentPage, projectsPerPage]);

    const handleProjectClick = (projectId) => {
        router.push(`/admin/projects/${projectId}`);
    };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    if (loading) return <PageLoader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-end mb-4">
                    <button
                        className="px-4 py-2 bg-white border rounded shadow"
                        onClick={() => {
                            setIsCompleted(!isCompleted);
                            dispatch(setCurrentPage(1));
                        }}
                    >
                        {isCompleted ? 'Show Current Projects' : 'Show Completed Projects'}
                    </button>
                </div>

                {!loading && projects?.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
                        <p className="text-gray-600">No projects found in this category</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isCompleted ? 'Completed Projects' : 'Current Projects'}
                            </h2>
                            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                                {projects?.length || 0} Projects
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                    onClick={() => handleProjectClick(project._id)}
                                />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ProjectsPage;