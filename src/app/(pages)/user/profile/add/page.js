'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '@/lib/store/features/authSlice';
import { PageLoader } from '@/components/LoadingComponent';
import AddProfileForm from '@/components/ProfileCompany/AddProfileForm';

export default function AddProfile() {
    const userId = useSelector((state) => state.auth?.user?.user?._id);
    const isRP = useSelector((state) => state.auth?.user?.user?.isRP);
    const currentRole = useSelector((state) => state.auth?.user?.user?.role);
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
        <>
            <AddProfileForm currentRole={currentRole} userId={userId} isRP={isRP}/>
        </>
    );
}