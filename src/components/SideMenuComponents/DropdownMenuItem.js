import React, { useState } from 'react';
import { Box, Typography, Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DropdownMenuItem = ({ label, icon, children }) => {
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton onClick={handleToggle} sx={{ borderRadius: '12px' }}>
                <ListItemIcon>
                    {React.cloneElement(icon, { style: { color: '#3a5afc' } })}
                </ListItemIcon>
                <ListItemText primary={label} />
                {open ? <ChevronUp /> : <ChevronDown />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {React.Children.map(children, (child) =>
                        React.cloneElement(child, {
                            sx: {
                                pl: 4, // Increase left padding for indentation
                                '& .MuiListItemIcon-root': {
                                    minWidth: '36px', // Reduce icon container width
                                },
                                '& .MuiTypography-root': {
                                    fontSize: '0.9rem', // Reduce font size
                                },
                            },
                        })
                    )}
                </List>
            </Collapse>
        </>
    );
};

export default DropdownMenuItem;