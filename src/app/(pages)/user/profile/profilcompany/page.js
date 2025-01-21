'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Search from '@/components/ProfileCompany/Search';
import { CreateProfile } from '@/components/ProfileCompany/buttons';
import ProfilesList from '@/components/ProfileCompany/ProfilesList';
import { fetchAllComapnyProfiles, fetchCompanyByContractor } from '@/lib/store/features/contractorSlice';
import { PageLoader } from '@/components/LoadingComponent';
import { fetchUser } from '@/lib/store/features/authSlice';
import { fetchAllSubComapnyProfiles } from '@/lib/store/features/subContractorSlice';


const ProfilsPage = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.contractor.loading)||useSelector((state) => state.subContractor.loading);
    const user = useSelector((state) => state.auth.user?.user);
    const companyProfils = useSelector((state)=>state.contractor.companyProfiles?.companyProfiles);
    const subProfils=useSelector((state) => state.subContractor.subCompanyProfiles?.subCompanyProfiles);

    useEffect(() => {
            dispatch(fetchUser());
        }, [dispatch]);

    useEffect(() => {
          if (user && user._id) { // Ensure user and user._id are defined
            if (user?.role ==='SubManager'|| user?.role ==='SubAdministrator') {
              if(user.companyId){
                dispatch(fetchAllSubComapnyProfiles({ id: user.companyId }));
                console.log("this is company id : "+user.companyId);
              }
          } else {
              dispatch(fetchAllComapnyProfiles(user.companyId));
          }
          }
      }, [dispatch, user])
      
    if (loading) return <PageLoader />;
    const profiles = user?.role ==='SubManager'|| user?.role ==='SubAdministrator' ? subProfils : companyProfils;
    return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
       <main className="container mx-auto px-4 py-8">
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform hover:shadow-xl transition-all">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Company Profiles Overview</h1>
                    <p className="text-gray-400">
                      Manage current team profiles
                    </p>
                </div>
              <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search profiles..." />
                {user?.role !== "supervisor" && <CreateProfile />}
              </div>
                <ProfilesList profiles={profiles} />
            </div>
        </main>
    </div>
    );
};
export default ProfilsPage;
