
import React from 'react';
import Link from 'next/link';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DropdownMenuItem from './DropdownMenuItem';
import { usePathname } from 'next/navigation';

const MenuItemsList = ({ items, isSubItem = false, handleMenuItemClick }) => {
    const pathname = usePathname();

    return items.map((item) => {
        if (item.items) {
            return (
                <DropdownMenuItem key={item.label} label={item.label} icon={item.icon}>
                    <MenuItemsList
                        items={item.items}
                        isSubItem={true}
                        handleMenuItemClick={handleMenuItemClick}
                    />
                </DropdownMenuItem>
            );
        }

        const isActive = pathname === item.href;
        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuItemClick}
                style={{ textDecoration: 'none' }}
            >
                <ListItemButton
                    selected={isActive}
                    sx={{
                        borderRadius: '12px',
                        mb: 1,
                        pl: isSubItem ? 4 : 2,
                        backgroundColor: "inherit",
                    }}
                >
                    <ListItemIcon sx={{ minWidth: isSubItem ? '32px' : '44px' }}>
                        {React.cloneElement(item.icon, {
                            style: {
                                color: isActive ? '#00008B' : '#3253fa',
                                fontSize: isSubItem ? '20px' : '24px',
                            },
                        })}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: isSubItem ? '0.9rem' : '1rem' }}
                    />
                </ListItemButton>
            </Link>
        );
    });
};

export default MenuItemsList;