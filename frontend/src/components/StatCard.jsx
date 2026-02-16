import React, { useState, useEffect } from 'react';

const StatCard = ({ icon: Icon, label, value, trend, suffix = '', iconColor = 'primary' }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const numericValue = parseFloat(value) || 0;
        let start = 0;
        const duration = 1000;
        const increment = numericValue / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
                setDisplayValue(numericValue);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    const iconColorClasses = {
        primary: 'bg-primary-500/10 text-primary-400 ring-1 ring-primary-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
        danger: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
        accent: 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20',
    };

    const getValueColor = (color) => {
        switch (color) {
            case 'success': return 'text-emerald-400';
            case 'danger': return 'text-red-400';
            case 'warning': return 'text-amber-400';
            case 'accent': return 'text-indigo-400';
            default: return 'text-white';
        }
    };

    const trendColorClasses = trend?.direction === 'up'
        ? 'text-emerald-400'
        : trend?.direction === 'down'
            ? 'text-red-400'
            : 'text-gray-400';

    return (
        <div className="card card-hover">
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColorClasses[iconColor]}`}>
                    <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-sm font-medium text-gray-400">{label}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                        <p className={`text-2xl font-bold ${getValueColor(iconColor)}`}>{displayValue}</p>
                        {suffix && <span className="text-sm font-medium text-gray-400">{suffix}</span>}
                    </div>
                    {trend && (
                        <span className={`text-sm font-medium ${trendColorClasses} mt-1 block`}>
                            {trend.value > 0 && '+'}
                            {trend.value}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
