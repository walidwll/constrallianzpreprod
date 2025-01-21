'use client'
import React, { useEffect, useState } from 'react';
import AddProjectForm from '@/components/Contractor/AddProjectForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '@/lib/store/features/authSlice';
import { PageLoader } from '@/components/LoadingComponent';

export default function AddProject() {
    const userId = useSelector((state) => state.auth?.user?.user?._id);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUser()).then((result) => {
            if (fetchUser.fulfilled.match(result)) {
                setLoading(false);
            }
        });
    }, [dispatch]);

    if (loading) {
        return <PageLoader />
    }

    return (
        <div>
            <AddProjectForm userId={userId} />
        </div>
    );
}