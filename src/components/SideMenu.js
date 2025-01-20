"use client";
import React, { useEffect } from 'react';
import { Box, Drawer, Skeleton, Typography, CircularProgress } from '@mui/material';
import { FaTools } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, fetchUser, logoutAdmin } from '@/lib/store/features/authSlice';
import MenuContent from './SideMenuComponents/MenuContent';
import { MENU_ITEMS_BY_ROLE } from './SideMenuComponents/MenuItems';
import { fetchSubCompany } from '@/lib/store/features/subContractorSlice';

const SideMenu = ({ isOpen, toggleMenu }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.auth?.user?.user ?? null);
    const company = useSelector((state) => state?.subContractor?.subCompany?.subCompany );
    const role = (user?.role || 'SubManager').toLowerCase();
    //const menuItems = MENU_ITEMS_BY_ROLE[role] || MENU_ITEMS_BY_ROLE['sub-contractor'];

    const getMenuItems = (role, user, company) => {
        const getMenuForRole = MENU_ITEMS_BY_ROLE[role] || MENU_ITEMS_BY_ROLE['SubManager'];
        return getMenuForRole(user, company);
    };

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        }else if(user?.role ==='SubManager'|| user?.role ==='SubAdministrator'){
            dispatch(fetchSubCompany({ id: user?.companyId }));
        }
    }, [dispatch, user]);

    const menuItems =getMenuItems(role, user, company);

    const handleLogout = async () => {
        try {
            if (user?.role === 'admin') {
                const result = await dispatch(logoutAdmin());
                if (result.meta.requestStatus === 'fulfilled') {
                    window.location.href = '/admin/login';
                }
                return;
            }

            const result = await dispatch(logoutUser());
            if (result.meta.requestStatus === 'fulfilled') {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleMenuItemClick = () => {
        if (window.innerWidth < 768) {
            toggleMenu();
        }
    };

    if (!user) return null;

    if (!role) {
        return (
            <Box sx={{ width: 280, height: '100vh', display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: '#f4f7ff', }}>
                {/* Header */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: 2, 
                    background: '#3a5afc', 
                    borderBottom: '1px solid rgba(255,255,255,0.1)', 
                    width: '100%', 
                    height: '70px',  // Standardized height
                    minHeight: '70px' // Ensure minimum height
                }}>
                    <FaTools style={{ color: 'white', marginRight: '8px', fontSize: '24px' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', flexGrow: 1 }}>
                        Site Management
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, padding: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[...Array(6)].map((_, index) => (
                        <Skeleton key={index} variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                    ))}
                </Box>
            </Box>
        );
    }

    const menuContent = <MenuContent
        toggleMenu={toggleMenu}
        menuItems={menuItems}
        handleMenuItemClick={handleMenuItemClick}
        handleLogout={handleLogout}
    />;

    return (
        <>
            <Drawer
                variant="temporary"
                open={isOpen}
                onClose={toggleMenu}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, overflow: 'hidden' },
                }}
            >
                {menuContent}
            </Drawer>
            <Drawer
                variant="persistent"
                open
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, overflow: 'hidden' },
                }}
            >
                {menuContent}
            </Drawer>
        </>
    );
};

export default SideMenu;