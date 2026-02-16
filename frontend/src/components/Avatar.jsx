import React from 'react';

const Avatar = ({ name, size = 'md', className = '' }) => {
    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-24 h-24 text-3xl',
    };

    return (
        <div
            className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br from-primary-500 to-accent-500 
        flex items-center justify-center 
        text-white font-semibold
        shadow-md
        ${className}
      `}
        >
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
