
import React from 'react';
import { Box, Typography, IconButton, List } from '@mui/material';
import { Menu as MenuIcon, LogOut } from 'lucide-react';
import { FaTools } from 'react-icons/fa';
import MenuItemsList from './MenuItemsList';

const MenuContent = ({ toggleMenu, menuItems, handleMenuItemClick, handleLogout }) => {
    return (
        <Box
            className="bg-blue-100"
            sx={{
                width: 280,
                height: '100vh',
                backgroundColor: '#e0e5f5',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 2,
                background: '#3a5afc',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                width: '100%',
                height: '70px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <FaTools style={{ color: 'white', marginRight: '8px', fontSize: '24px' }} />
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    flexGrow: 1,
                    fontSize: '18px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}>
                    Site Management
                </Typography>
                <Box sx={{
                    display: { md: 'none' },
                    justifyContent: 'flex-end',
                    padding: 1
                }}>
                    <IconButton onClick={toggleMenu}>
                        <MenuIcon style={{ color: "#fff", fontWeight: "bold" }} />
                    </IconButton>
                </Box>
            </Box>

            <List sx={{ flexGrow: 1, padding: 3, overflowY: 'auto' }}>
                <MenuItemsList items={menuItems} handleMenuItemClick={handleMenuItemClick} />
            </List>

            <Box sx={{ padding: 2 }}>
                <button
                    onClick={handleLogout}
                    className="block sm:hidden flex items-center w-full p-3 bg-gray-100 border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-sm text-red-600"
                >
                    <LogOut className="mr-3 text-red-500" />
                    <Typography>Logout</Typography>
                </button>
            </Box>
        </Box>
    );
};

export default MenuContent;