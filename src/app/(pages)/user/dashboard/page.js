'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logoutUser } from '@/lib/store/features/authSlice';
import ContractorDashboard from '@/components/Contractor/ContractorDashboard';
import SubContractorDashboard from '@/components/SubContractor/SubContractorDashboard';
import EmployeeDashboard from '@/components/Employee/EmployeeDashboard';
import { PageLoader } from '@/components/LoadingComponent';
import NoDataAvailable from '@/components/NoData';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user?.user);
    const loading = useSelector((state) => state.auth.loading);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const logout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            router.push('/login');
        }
    };

    if (loading) {
        return <div>
            <PageLoader />
        </div>;
    }

    if (!user) {
        return (
            <div>
                <NoDataAvailable
                    type="companies"
                    title="User Not Found"
                    message="Please log in to add companies to your profile."
                    actionButton={
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Log In
                        </button>
                    }
                />
            </div>
        );
    }
    return (
        <div>
            {['SubManager', 'SubAdministrator'].includes(user.role) && <SubContractorDashboard user={user} logout={logout} />}
            {user.role === 'Employee' && <EmployeeDashboard user={user} logout={logout} />}
            {['director', 'production', 'supervisor'].includes(user.role) && <ContractorDashboard user={user} logout={logout} />}
        </div>
    );
}