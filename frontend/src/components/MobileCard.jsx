import React from 'react';

const MobileCard = ({ title, data, onView }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-3">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {onView && (
                    <button
                        onClick={onView}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        View
                    </button>
                )}
            </div>
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MobileCard;
