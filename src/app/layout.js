// RootLayout.js
"use client";
import React, { useState } from 'react';
import "./globals.css";
import { Poppins } from 'next/font/google';
import { ReduxProvider } from '@/lib/store/provider';
import SideMenu from '@/components/SideMenu';
import { CssBaseline, Box, useMediaQuery, ThemeProvider, createTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';


const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});


const theme = createTheme();

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const excludedRoutes = ['/', '/login', '/signup', '/admin/login', '/join','/invited','/invited/subcontractor'];
  const showSideMenu = !excludedRoutes.includes(pathname);

  return (
    <html lang="en" className={poppins.class} suppressHydrationWarning>
      <head>
        <title>Site Management</title>
        <meta name="description" content="Site Management" />
      </head>
      <body suppressHydrationWarning>
        <CssBaseline />
        <ReduxProvider>
          <ThemeProvider theme={theme}>
            <Toaster position="top-center" reverseOrder={false} />
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              {showSideMenu && (
                <SideMenu
                  isOpen={isMenuOpen}
                  toggleMenu={toggleMenu}
                  sx={{ 
                    boxShadow: 40,
                    display: { xs: isMenuOpen ? 'block' : 'none', md: 'block' },
                    position: { xs: 'fixed', md: 'static' },
                    zIndex: { xs: 1200, md: 1 },
                  }}
                />
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  overflow: 'hidden',
                  marginLeft: { md: showSideMenu ? '280px' : '0' },
                  transition: 'margin-left 0.3s ease',
                  width: '100%',
                }}
              >
                {showSideMenu && <Navbar 
                  toggleMenu={toggleMenu}
                  isMobile={isMobile}
                />}
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto', 
                    height: '100vh', 
                    paddingTop: '70px', 
                    marginTop: '-70px',
                  }}
                >
                  {children}
                </Box>
              </Box>
            </Box>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}