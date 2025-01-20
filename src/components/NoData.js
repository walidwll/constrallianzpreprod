import React from 'react';
import {
    FileQuestion,
    AlertCircle,
    Database,
    FilesIcon,
    UserX,
    Building2,
    PackageX,
    Search
} from 'lucide-react';

const NoDataAvailable = ({
    title = "No Data Available",
    message = "We couldn't find any data to display",
    type = "default",
    actionButton = null
}) => {
    // Icon mapping based on type
    const iconMap = {
        default: FileQuestion,
        users: UserX,
        companies: Building2,
        products: PackageX,
        files: FilesIcon,
        search: Search,
        database: Database,
        alert: AlertCircle
    };

    // Get the appropriate icon component
    const IconComponent = iconMap[type] || FileQuestion;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full to-white rounded-2xl p-8">
            <div className="bg-blue-100 rounded-full p-6 mb-6">
                <IconComponent className="w-12 h-12 text-blue-500" />
            </div>

            <h3 className="text-2xl font-bold text-blue-800 mb-3 text-center">
                {title}
            </h3>

            <p className="text-blue-600 text-center max-w-md mb-6">
                {message}
            </p>

            {actionButton && (
                <div className="mt-2">
                    {actionButton}
                </div>
            )}
        </div>
    );
};

export default NoDataAvailable;