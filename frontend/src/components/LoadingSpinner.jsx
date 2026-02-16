import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    const spinner = (
        <div className="flex items-center justify-center">
            <div
                className={`${sizes[size]} border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin`}
            />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
