import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className="card animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                );

            case 'stat':
                return (
                    <div className="card animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                );

            case 'table-row':
                return (
                    <tr className="border-b border-gray-100">
                        <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-32 skeleton"></div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-24 skeleton"></div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-20 skeleton"></div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="h-6 bg-gray-200 rounded-full w-16 skeleton"></div>
                        </td>
                    </tr>
                );

            case 'text':
                return (
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded skeleton"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 skeleton"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6 skeleton"></div>
                    </div>
                );

            default:
                return <div className="h-20 bg-gray-200 rounded skeleton"></div>;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
            ))}
        </>
    );
};

export default LoadingSkeleton;
