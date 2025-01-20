'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject } from '@/lib/store/features/contractorSlice';
import {
    Building2, Users, DollarSign, Clock, Calendar,
    Mail, Phone, ArrowLeft, Shield, Briefcase, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/LoadingComponent';
import toast from 'react-hot-toast';
import { fetchEmployeeDetails, updateEmployeeDetails } from '@/lib/store/features/employeeSlice';

const StatCard = ({ icon: Icon, label, value, className = "" }) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${className}`} />
            <div>
                <p className="text-xs md:text-sm text-gray-500">{label}</p>
                <p className="text-lg md:text-xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

const TeamMemberCard = ({ member, type }) => {
    const router = useRouter();
    const isContractor = type === 'contractor';
    const roleColors = {
        contractor: 'bg-purple-100 text-purple-700 border-purple-200',
        subcontractor: 'bg-blue-100 text-blue-700 border-blue-200',
        employee: 'bg-green-100 text-green-700 border-green-200'
    };

    const [isNavigating, setIsNavigating] = useState(false);


    const handleViewDetails = (e) => {
        e.preventDefault();
        if (isNavigating) return;

        setIsNavigating(true);
        try {
            router.push(`/employee/${member._id}`);
        } catch (error) {
            console.error('Navigation failed:', error);
            toast.error('Failed to navigate to employee details');
            setIsNavigating(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 md:p-6 flex flex-col md:flex-row">
            <div className="relative flex-shrink-0">
                {isContractor ? (
                    <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-purple-600" />
                    </div>
                ) : (
                    <img
                        src={member.image || '/default-avatar.png'}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                    />
                )}
            </div>

            <div className="flex-1 text-center md:text-left md:ml-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roleColors[type]}`}>
                        {member.role}
                    </span>
                </div>

                <div className="space-y-2">
                    <p className="flex items-center justify-center md:justify-start text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                        {member.email}
                    </p>
                    <p className="flex items-center justify-center md:justify-start text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-green-500" />
                        {member.phone}
                    </p>
                    <p className="flex items-center justify-center md:justify-start text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MachineryCard = ({ machinery }) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">{machinery.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">{machinery.category}</p>
                <p className="text-xs md:text-sm text-gray-500">{machinery.model}</p>
                <div className="mt-2 flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${machinery.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {machinery.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {machinery.type}
                    </span>
                </div>
            </div>
        </div>
        <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700">Cost Details:</h4>
            {machinery.costDetails.length > 0 ? (
                <ul className="mt-2 space-y-1">
                    {machinery.costDetails.map((costDetail, index) => (
                        <li key={index} className="text-xs text-gray-600">
                            <span className="font-medium">Project ID:</span> {costDetail.projectId} -
                            <span className="font-medium"> Cost:</span> ${costDetail.cost} -
                            <span className="font-medium"> Hours:</span> {costDetail.totalHours}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-gray-600">No cost details available.</p>
            )}
        </div>
    </div>
);

const EmployeeCard = ({ employee }) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center space-x-3">
            <img
                src={employee.image || '/default-avatar.png'}
                alt={employee.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
            <div>
                <p className="text-lg md:text-xl font-bold text-gray-800">{employee.name}</p>
                <p className="text-xs md:text-sm text-gray-500">{employee.role}</p>
                <p className="text-xs md:text-sm text-gray-500">{employee.email}</p>
                <p className="text-xs md:text-sm text-gray-500">{employee.phone}</p>
            </div>
        </div>
    </div>
);

const ProjectDetailsPage = ({ params }) => {
    const { id: projectId } = React.use(params);
    const dispatch = useDispatch();
    const router = useRouter();
    const project = useSelector((state) => state.contractor.project);
    const loading = useSelector((state) => state.contractor.loading);
    const userRole = useSelector((state) => state.auth.user?.user?.role);

    useEffect(() => {
        if (projectId) {
            dispatch(fetchProject(projectId));
        }
    }, [dispatch, projectId]);

    if (loading) return <PageLoader />;

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Project Found</h2>
                    <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => router.push('/user/dashboard')}
                        className="flex items-center justify-center space-x-2 mx-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Go Back</span>
                    </button>
                </div>
            </div>
        );
    }

    const TeamSection = ({ title, members, type, icon: Icon, iconColor }) => (
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Icon className={`w-5 h-5 mr-2 ${iconColor}`} />
                    {title}
                    <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {members?.length || 0}
                    </span>
                </h2>
            </div>
            {members?.length > 0 ? (
                <div className={`grid grid-cols-1 ${type === 'employee' ? '' : 'lg:grid-cols-2 xl:grid-cols-3'} gap-4`}>
                    {members.map((member) => (
                        <TeamMemberCard
                            key={member._id}
                            member={member}
                            type={type}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No {title.toLowerCase()} found.</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="container mx-auto px-4 py-6 md:py-8">
                <button
                    onClick={() => router.push('/user/dashboard')}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
                            <p className="text-gray-600">{project.description}</p>
                        </div>
                        <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full ${project.isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {project.isCompleted ? 'Completed' : 'In Progress'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={DollarSign} label="Budget" value={`$${project?.budget}`} className="text-green-600" />
                        <StatCard icon={Building2} label="Company" value={project?.companyId?.name} className="text-blue-600" />
                        <StatCard icon={Users} label="Team Size" value={(project.employeesId?.length || 0)} className="text-purple-600" />
                        <StatCard icon={Calendar} label="Start Date" value={new Date(project.createdAt).toLocaleDateString()} className="text-orange-600" />
                    </div>
                </div>

                <div className="space-y-6">
                    <TeamSection
                        title="Contractors"
                        members={project?.companyId?.contractors}
                        type="contractor"
                        icon={Shield}
                        iconColor="text-purple-600"
                    />
                    <TeamSection
                        title="Employees"
                        members={project?.employeesId}
                        type="employee"
                        icon={Users}
                        iconColor="text-green-600"
                    />
                    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Machinery</h2>
                        {project?.machineryId?.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {project.machineryId.map((machinery) => (
                                    <MachineryCard key={machinery._id} machinery={machinery} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No machinery found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;