import React from 'react';

const StatusBadge = ({ status }) => {
    const statusConfig = {
        present: {
            label: 'Present',
            className: 'badge-present',
        },
        absent: {
            label: 'Absent',
            className: 'badge-absent',
        },
        late: {
            label: 'Late',
            className: 'badge-late',
        },
        'half-day': {
            label: 'Half Day',
            className: 'badge-half-day',
        },
    };

    const config = statusConfig[status] || statusConfig.present;

    return <span className={`badge ${config.className}`}>{config.label}</span>;
};

export default StatusBadge;
