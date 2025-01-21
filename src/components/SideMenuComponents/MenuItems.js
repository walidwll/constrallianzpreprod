import {
    LayoutDashboard, Users, Briefcase, Settings, Building, LockKeyhole,
    GitPullRequestCreateArrow, BriefcaseBusiness, Building2, FileUser,
    Files, Hammer,
    Cable,
    UserPen,
    MessageCirclePlus,
    PersonStanding,
    BrainCircuit,
    QrCode,
    Factory,
    File,
    FileChartLine,
    HeartHandshake,
    ShieldCheck,
    BadgePlus,
    FileChartColumnIncreasing,
    Flag,
    Bell,
    UserRoundPlus,
    UserRoundSearch,
    Tractor,
    HardHat,
    BadgeEuro,
    Pickaxe
} from 'lucide-react';
import { FaTasks, FaUserShield } from 'react-icons/fa';

export const MENU_ITEMS_BY_ROLE = {
    SubManager: (user,company) => [
        {
            href: '/user/dashboard',
            icon: <LayoutDashboard />,
            label: 'Dashboard'
        },
        {
            label: 'Resources',
            icon: <Cable />,
            items: [
                {
                    href: '/company',
                    icon: <Building2 />,
                    label: 'Company'
                },
                ...(company?.speciality === "machinery" ? [{
                    href: '/user/machinery',
                    icon: <Hammer />,
                    label: 'Machinery'
                }] : []),
                ...(company?.speciality === "machinery" ? [{
                    href: '/user/machinery/employee',
                    icon: <Tractor />,
                    label: 'Employee Machine'
                }] : []),
                ...(company?.speciality === "machinery" ? [{
                    href: '/user/machinery/pricing',
                    icon: <Tractor />,
                    label: 'Pricing'
                }] : []),
                ...(company?.speciality === "employee" ? [{
                    href: '/user/employee',
                    icon: <HardHat />,
                    label: 'Employees'
                }] : []),
                ...(company?.speciality === "employee" ? [{
                    href: '/user/employee/pricing',
                    icon: <BadgeEuro />,
                    label: 'Employees prices'
                }] : []),
                ...(company?.speciality === "material" ? [{
                    href: '/user/material',
                    icon: <Pickaxe />,
                    label: 'Material Industrial'
                }] : []),
                ...(company?.speciality === "material" ? [{
                    href: '/user/material/pricing',
                    icon: <BadgeEuro />,
                    label: 'Material prices'
                }] : []),
            ]
        },
        {   
            label:'Profiles',
            icon:<Users/>,
            items:[
                {
                    href:'/user/profile/profilcompany',
                    icon:<UserRoundSearch />,
                    label:' View Profiles'
                },
                {
                    href:'/user/profile/add',
                    icon:<UserRoundPlus/>,
                    label:' Add Profile'
                },
            ]
        },
        {
            href: '/user/projects',
            icon: <BriefcaseBusiness />,
            label: 'Projects'
        },
        {
            href: '/user/company/reports',
            icon: <Files />,
            label: 'Reports'
        },

        {
            label: 'Requests',
            icon: <MessageCirclePlus />,
            items: [
                ...(company?.speciality === "machinery" && user?.isRP ? [{
                    href: '/user/machinery/requests',
                    icon: <BrainCircuit />,
                    label: 'Machinery Requests'
                }] : []),
                ...(company?.speciality === "employee" && user?.isRP ? [{
                    href: '/user/projects/employee/requests',
                    icon: <PersonStanding />,
                    label: 'Employee Requests'
                }] : []),
                ...(company?.speciality === "employee" && user?.isRP ? [{
                    href: '/employee/applications',
                    icon: <Briefcase />,
                    label: 'Employee Applications'
                }] : []),
            ]
        },
        {
            href: '/notifications',
            icon: <Bell />,
            label: 'Notifications'
        },
        {
            href: '/support',
            icon: <HeartHandshake />,
            label: 'Support'
        },
        {
            href: '/safety',
            icon: <ShieldCheck />,
            label: 'Safety'
        },
    ],
    SubAdministrator: (user,company) => [
        {
            href: '/user/dashboard',
            icon: <LayoutDashboard />,
            label: 'Dashboard'
        },
        {
            label: 'Resources',
            icon: <Cable />,
            items: [
                {
                    href: '/company',
                    icon: <Building2 />,
                    label: 'Company'
                },
                ...(company?.speciality === "machinery" ? [{
                    href: '/user/machinery',
                    icon: <Hammer />,
                    label: 'Machinery'
                }] : []),
                ...(company?.speciality === "machinery" ? [{
                    href: '/user/machinery/employee',
                    icon: <Tractor />,
                    label: 'Employee Machine'
                }] : []),
                ...(company?.speciality === "machinery" ? [{
                    href: '/user/machinery/pricing',
                    icon: <Tractor />,
                    label: 'Pricing'
                }] : []),
                ...(company?.speciality === "employee" ? [{
                    href: '/user/employee',
                    icon: <HardHat />,
                    label: 'Employees'
                }] : []),
                ...(company?.speciality === "employee" ? [{
                    href: '/user/employee/pricing',
                    icon: <BadgeEuro />,
                    label: 'Employees prices'
                }] : []),
                ...(company?.speciality === "material" ? [{
                    href: '/user/material',
                    icon: <Pickaxe />,
                    label: 'Material Industrial'
                }] : []),
                ...(company?.speciality === "material" ? [{
                    href: '/user/material/pricing',
                    icon: <BadgeEuro />,
                    label: 'Material prices'
                }] : []),
            ]
        },
        {   
            label:'Profiles',
            icon:<Users/>,
            items:[
                {
                    href:'/user/profile/profilcompany',
                    icon:<UserRoundSearch />,
                    label:' View Profiles'
                },
                ...(user?.isRP ? [{
                    href:'/user/profile/add',
                    icon:<UserRoundPlus/>,
                    label:' Add Profile'
                },] : []),
            ]
        },
        {
            href: '/user/projects',
            icon: <BriefcaseBusiness />,
            label: 'Projects'
        },
        {
            href: '/user/company/reports',
            icon: <Files />,
            label: 'Reports'
        },

        {
            label: 'Requests',
            icon: <MessageCirclePlus />,
            items: [
                ...(company.speciality === "machinery" && user?.isRP ? [{
                    href: '/user/machinery/requests',
                    icon: <BrainCircuit />,
                    label: 'Machinery Requests'
                }] : []),
                ...(company.speciality === "employee" && user?.isRP ? [{
                    href: '/user/projects/employee/requests',
                    icon: <PersonStanding />,
                    label: 'Employee Requests'
                }] : []),
                ...(company.speciality === "employee" && user?.isRP ? [{
                    href: '/employee/applications',
                    icon: <Briefcase />,
                    label: 'Employee Applications'
                }] : []),
            ]
        },
        {
            href: '/notifications',
            icon: <Bell />,
            label: 'Notifications'
        },
        {
            href: '/support',
            icon: <HeartHandshake />,
            label: 'Support'
        },
        {
            href: '/safety',
            icon: <ShieldCheck />,
            label: 'Safety'
        },
    ],
    employee: () => [
        {
            href: '/user/dashboard',
            icon: <FaTasks />,
            label: 'Dashboard'
        },
        {
            href: '/projects',
            icon: <Briefcase />,
            label: 'Working Details'
        },
        {
            href: '/applications',
            icon: <FileUser />,
            label: 'My Applications'
        },
        {
            href: '/notifications',
            icon: <Bell />,
            label: 'Notifications'
        },
        {
            href: '/support',
            icon: <HeartHandshake />,
            label: 'Support'
        },
        {
            href: '/safety',
            icon: <ShieldCheck />,
            label: 'Safety'
        },
    ],
    supervisor: () =>[
        {
            href: '/user/dashboard',
            icon: <LayoutDashboard />,
            label: 'Dashboard'
        },
        {   
            label:'Profiles',
            icon:<Users/>,
            items:[
                {
                    href:'/user/profile/profilcompany',
                    icon:<UserRoundSearch />,
                    label:' View Profiles'
                }
            ]

        },
        {
            label: 'Projects',
            icon: <Cable />,
            items: [
                {
                    href: '/user/projects',
                    icon: <BriefcaseBusiness />,
                    label: 'View Projects'
                },
            ]
        },
        {
            label: 'Contracotrs & Documents',
            icon: <File />,
            items: [
                {
                    href: '/user/documents',
                    icon: <FileChartLine />,
                    label: 'Manage Documents'
                },

            ]
        },
        {
            href: '/industrials',
            icon: <Factory />,
            label: ' Industrials'
        },
        {
            href: '/user/reports',
            icon: <Files />,
            label: ' Reports'
        },
        {
            href: '/safety',
            icon: <ShieldCheck />,
            label: 'Safety'
        },
        {
            href: '/user/qr',
            icon: <QrCode />,
            label: 'QR Code'
        },
        {
            href: '/notifications',
            icon: <Bell />,
            label: 'Notifications'
        },

        {
            href: '/support',
            icon: <HeartHandshake />,
            label: 'Support'
        },
    ],
    production: (user) =>[
        {
            href: '/user/dashboard',
            icon: <LayoutDashboard />,
            label: 'Dashboard'
        },
        {   
            label:'Profiles',
            icon:<Users/>,
            items:[
                {
                    href:'/user/profile/profilcompany',
                    icon:<UserRoundSearch />,
                    label:' View Profiles'
                },
                {
                    href:'/user/profile/add',
                    icon:<UserRoundPlus/>,
                    label:' Add Profile'
                }
        
            ]

        },
        {
            label: 'Projects',
            icon: <Cable />,
            items: [
                {
                    href: '/user/projects',
                    icon: <BriefcaseBusiness />,
                    label: 'View Projects'
                },
                ...( user?.addProject ? [{
                    href: '/user/projects/add',
                    icon: <GitPullRequestCreateArrow />,
                    label: ' Add Projects'
                }] : []),
            ]
        },
        {
            label: 'Contracotrs & Documents',
            icon: <File />,
            items: [
                {
                    href: '/user/documents',
                    icon: <FileChartLine />,
                    label: 'Manage Documents'
                },

            ]
        },
        {
            href: '/industrials',
            icon: <Factory />,
            label: ' Industrials'
        },
        {
            href: '/user/reports',
            icon: <Files />,
            label: ' Reports'
        },
        {
            href: '/safety',
            icon: <ShieldCheck />,
            label: 'Safety'
        },
        {
            href: '/notifications',
            icon: <Bell />,
            label: 'Notifications'
        },

        {
            href: '/support',
            icon: <HeartHandshake />,
            label: 'Support'
        },
    ],
    director: () => [
        {
            href: '/user/dashboard',
            icon: <LayoutDashboard />,
            label: 'Dashboard'
        },
        {
            href: '/user/reports',
            icon: <Files />,
            label: ' Reports'
        },
        {
            href: '/industrials',
            icon: <Factory />,
            label: ' Industrials'
        },
        {   
            label:'Profiles',
            icon:<Users/>,
            items:[
                {
                    href:'/user/profile/profilcompany',
                    icon:<UserRoundSearch />,
                    label:' View Profiles'
                },
                {
                    href:'/user/profile/add',
                    icon:<UserRoundPlus/>,
                    label:' Add Profile'
                }
        
            ]

        },
        {
            label: 'Projects',
            icon: <Cable />,
            items: [
                {
                    href: '/user/projects',
                    icon: <BriefcaseBusiness />,
                    label: 'View Projects'
                },
                {
                    href: '/user/projects/add',
                    icon: <GitPullRequestCreateArrow />,
                    label: ' Add Projects'
                },
            ]
        },
        {
            label: 'Contracotrs & Documents',
            icon: <File />,
            items: [
                {
                    href: '/user/documents',
                    icon: <FileChartLine />,
                    label: 'Manage Documents'
                },

            ]
        },
        {
            href: '/safety',
            icon: <ShieldCheck />,
            label: 'Safety'
        },
        {
            href: '/notifications',
            icon: <Bell />,
            label: 'Notifications'
        },

        {
            href: '/support',
            icon: <HeartHandshake />,
            label: 'Support'
        },
    ],
    admin: () =>[
        {
            href: '/admin/dashboard',
            icon: <LayoutDashboard />,
            label: 'Dashboard'
        },
        {
            href: '/admin/projects',
            icon: <BriefcaseBusiness />,
            label: 'Projects'
        },
        {
            href: '/admin/requests',
            icon: <PersonStanding />,
            label: 'Sub Contractor Requests'
        },
        {
            href: '/admin/join-requests',
            icon: <BadgePlus />,
            icon: <BadgePlus />,
            label: 'Contractor Requests'
        },


        {
            href: '/admin/add-company',
            icon: <Building />,
            label: 'Add Company'
        },

        {
            label: 'Contracotrs & Documents',
            icon: <File />,
            items: [
                {
                    href: '/admin/documents',
                    icon: <FileChartLine />,
                    label: 'Manage Documents'
                },
                {
                    href: '/admin/documents/sub-contractors',
                    icon: <FileChartColumnIncreasing />,
                    label: 'Sub Contractors'
                }
            ]
        },
        {
            href: '/admin/reports',
            icon: <Flag />,
            label: 'Reports'
        },
        {
            href: '/industrials',
            icon: <Factory />,
            label: 'Industrials'
        },
        {
            href: '/support',
            icon: <HeartHandshake />,
            label: 'Support'
        },
        {
            href: '/safety',
            icon: <ShieldCheck />,
            label: 'Safety'
        },
    ]
};