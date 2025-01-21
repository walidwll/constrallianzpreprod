import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({
    variant = 'default',
    text = 'Loading...',
    size = 'default'
}) => {
    // Size configurations
    const sizeClasses = {
        small: {
            wrapper: 'min-h-[100px]',
            icon: 'w-6 h-6',
            text: 'text-sm'
        },
        default: {
            wrapper: 'min-h-[200px]',
            icon: 'w-12 h-12',
            text: 'text-base'
        },
        large: {
            wrapper: 'min-h-[300px]',
            icon: 'w-16 h-16',
            text: 'text-lg'
        }
    };

    // Variant configurations
    const variantClasses = {
        default: 'bg-blue-50 rounded-xl p-8',
        fullPage: 'fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 z-50',
        inline: 'bg-transparent',
        card: 'bg-white border-2 border-blue-100 rounded-xl shadow-lg p-6'
    };

    const selectedSize = sizeClasses[size];
    const baseClasses = 'flex flex-col items-center justify-center';
    const variantClass = variantClasses[variant];

    const spinnerContent = (
        <>
            <Loader2
                className={`${selectedSize.icon} text-blue-500 animate-spin mb-4`}
            />
            <h3 className={`font-semibold text-blue-800 mb-2 ${selectedSize.text}`}>
                {text}
            </h3>
            <p className="text-blue-600 text-center">Please wait while we process your request...</p>
        </>
    );

    // For inline variant, return simplified version
    if (variant === 'inline') {
        return (
            <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-blue-600">{text}</span>
            </div>
        );
    }

    return (
        <div className={`${baseClasses} ${variantClass} ${selectedSize.wrapper}`}>
            {spinnerContent}
        </div>
    );
};

// Export variations for easier usage
export const PageLoader = () => (
    <LoadingSpinner variant="fullPage" text="Loading Page" size="large" />
);

export const CardLoader = () => (
    <LoadingSpinner variant="card" text="Loading Content" size="default" />
);

export const InlineLoader = () => (
    <LoadingSpinner variant="inline" text="Loading..." size="small" />
);

export default LoadingSpinner;