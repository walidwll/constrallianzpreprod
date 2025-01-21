'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject, updateProject } from '@/lib/store/features/contractorSlice';
import {
    Building2, Users, DollarSign, Clock, Calendar,
    Mail, Phone, ArrowLeft, Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/LoadingComponent';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material';
import { addMachineryHours } from '@/lib/store/features/subContractorSlice';

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
        employee: 'bg-green-100 text-green-700 border-green-200'
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
                        src={member?.image || '/default-avatar.png'}
                        alt={member?.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                    />
                )}
            </div>

            <div className="flex-1 text-center md:text-left md:ml-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{member?.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roleColors[type]}`}>
                        {member?.role}
                    </span>
                </div>

                <div className="space-y-2">
                    <p className="flex items-center justify-center md:justify-start text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                        {member?.email}
                    </p>
                    <p className="flex items-center justify-center md:justify-start text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-green-500" />
                        {member?.phone}
                    </p>
                    <p className="flex items-center justify-center md:justify-start text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        {new Date(member?.createdAt).toLocaleDateString()}
                    </p>
                </div>
                {member?.role === 'Employee' && (
                    <button
                        onClick={() => router.push(`/employee/${member._id}`)}
                        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Manage Details
                    </button>
                )}
            </div>
        </div>
    );
};

const MachineryCard = ({ machine, projectId, project, user }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [hours, setHours] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddHours = async (e) => {
        e.preventDefault();
        if (!hours || isNaN(hours) || hours <= 0) {
            toast.error('Please enter valid hours');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(addMachineryHours({
                id: machine._id,
                projectId,
                hours: parseFloat(hours)
            })).unwrap();

            toast.success('Hours added successfully');
            setHours('');
        } catch (error) {
            toast.error(error.message || 'Failed to add hours');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{machine.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${machine.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {machine.status ? 'Available' : 'In Use'}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="flex items-center text-gray-600">
                    <span className="font-medium w-24">Category:</span>
                    <span>{machine.category}</span>
                </p>
                <p className="flex items-center text-gray-600">
                    <span className="font-medium w-24">Model:</span>
                    <span>{machine.model}</span>
                </p>
                <p className="flex items-center text-gray-600">
                    <span className="font-medium w-24">Type:</span>
                    <span>{machine.type}</span>
                </p>
            </div>

            {!project?.isCompleted && (user?.role === "production" || user?.role === "supervisor") && (
                <form onSubmit={handleAddHours} className="flex gap-2 mb-4">
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="Hours worked"
                        className="flex-1 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.5"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-2 py-1 rounded text-white ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {isSubmitting ? 'Adding...' : 'Add'}
                    </button>
                </form>
            )}

            <button
                onClick={() => router.push(`/user/machinery/${machine._id}`)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
                View Details
            </button>
        </div>
    );
};

const ProjectDetailsPage = ({ params }) => {
    const { id: projectId } = React.use(params);
    const dispatch = useDispatch();
    const router = useRouter();
    const project = useSelector((state) => state.contractor?.project);
    const loading = useSelector((state) => state.contractor?.loading);
    const user = useSelector((state) => state.auth?.user?.user);
    const [isCompleting, setIsCompleting] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    useEffect(() => {
        if (projectId) {
            dispatch(fetchProject(projectId));
        }
    }, [dispatch, projectId]);

    const updateProjectStatus = async () => {
        setIsCompleting(true);
        try {
            const result = await dispatch(updateProject(projectId)).unwrap();
            if (result) {
                toast.success('Project completed!');
                handleCloseModal();
                await dispatch(fetchProject(projectId));
            }
        } catch (error) {
            toast.error('Failed to update project status');
        } finally {
            setIsCompleting(false);
        }
    }


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
                {type === 'employee' && !project?.isCompleted && (user?.role === "production" || user?.role === "supervisor") && (
                    <button
                        onClick={() => router.push(`/employee/add/${projectId}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        +  <Users className="w-4 h-4" />
                        Employee
                    </button>
                )}
            </div>
            {members?.length > 0 ? (
                <div className={`grid grid-cols-1 ${type === 'employee' ? '' : 'lg:grid-cols-2 xl:grid-cols-3'} gap-4`}>
                    {members.map((member, index) => (
                        <TeamMemberCard
                            key={index}
                            member={member}
                            type={type}
                            projectId={projectId}
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
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full font-medium">
                                    #{project?.projectId}
                                </span>
                                {project?.isCompleted && (
                                    <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                                        Completed
                                    </span>
                                )}
                                {!project?.isCompleted && (
                                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                                        In Progress
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                                {project?.name}
                            </h1>
                            <p className="text-gray-600">
                                {project?.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={DollarSign} label="Budget" value={`$${project?.budget}`} className="text-green-600" />
                        <StatCard icon={Building2} label="Company" value={project?.companyId?.name} className="text-blue-600" />
                        <StatCard icon={Users} label="Team Size" value={(project?.employeesId?.length || 0)} className="text-purple-600" />
                        <StatCard icon={Calendar} label="Start Date" value={new Date(project.createdAt).toLocaleDateString()} className="text-orange-600" />
                    </div>

                    <div className="mt-6 flex justify-center">
                        {!project.isCompleted && (
                            <button
                                className={`
                                    bg-blue-500 text-white px-6 py-3 rounded-lg 
                                    hover:bg-blue-600 transition-colors
                                    flex items-center gap-2
                                    ${isCompleting ? 'opacity-75 cursor-not-allowed' : ''}
                                `}
                                onClick={handleOpenModal}
                                disabled={isCompleting}
                            >
                                {isCompleting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span>Mark as Completed</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">

                    <TeamSection
                        title="Team Members"
                        members={project?.employeesId}
                        type="employee"
                        icon={Users}
                        iconColor="text-green-600"
                    />
                    {/* Machinery Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                                Project Machinery
                                <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {project?.machineryId?.length || 0}
                                </span>
                            </h2>
                            {!project?.isCompleted && (user?.role === "production" || user?.role === "supervisor") && (
                                <button
                                    onClick={() => router.push(`/user/machinery/add/${projectId}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    + Add Machinery
                                </button>
                            )}
                        </div>
                        {project?.machineryId && project?.machineryId.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {project.machineryId.map((machine) => (
                                    <MachineryCard key={machine._id} machine={machine} projectId={projectId} project={project} user={user} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No machinery assigned to this project yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Complete Project?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to mark this project as completed?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModal}
                        color="primary"
                        disabled={isCompleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={updateProjectStatus}
                        color="primary"
                        variant="contained"
                        disabled={isCompleting}
                        autoFocus
                    >
                        {isCompleting ? 'Processing...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProjectDetailsPage;