import React from 'react';
import { FaBars } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

const Header = ({ toggleMenu }) => {
    const user = useSelector((state) => state.auth.user?.user);
    const pathname = usePathname();
    const noHeaderRoutes = ['/', '/login', '/signup'];

    if (!user || noHeaderRoutes.includes(pathname)) return null;

    return (
        <header className="bg-[#4169E1] text-white p-4 shadow-md w-full lg:hidden" style={{ height: '70px' }}>
            <div className="container mx-auto flex justify-between items-center h-full px-4 md:px-8">
                <FaBars onClick={toggleMenu} className="cursor-pointer text-2xl md:text-3xl" />
                {user?.role && <h1 className="text-sm md:text-2xl font-bold">{user?.role} Dashboard</h1>}
            </div>
        </header>
    );
};

export default Header;