import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { FiFileText, FiDownload, FiCalendar, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import { attendanceService } from '../services/attendanceService';

const ManagerReports = () => {
    const [reportConfig, setReportConfig] = useState({
        startDate: '',
        endDate: '',
        department: 'all',
        reportType: 'summary',
    });
    const [reportData, setReportData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleInputChange = (e) => {
        setReportConfig({ ...reportConfig, [e.target.name]: e.target.value });
    };

    const handleGenerateReport = async () => {
        if (!reportConfig.startDate || !reportConfig.endDate) {
            toast.error('Please select both start and end dates');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await attendanceService.generateReport(reportConfig);
            setReportData(response);
            toast.success('Report generated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate report');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = async (format) => {
        try {
            if (format === 'csv') {
                await attendanceService.exportAttendance({ ...reportConfig, format });
                toast.success('Export downloaded successfully');
            } else {
                toast.success(`Export as ${format.toUpperCase()} feature coming soon!`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Export failed');
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Reports</h1>
                    <p className="text-lg text-gray-600 mt-1">Generate and export attendance reports</p>
                </div>

                {/* Report Configuration */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-6">
                        <FiFileText className="w-6 h-6 text-primary-600" />
                        <h3 className="text-2xl font-semibold text-gray-900">Report Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div>
                            <label className="input-label text-lg flex items-center gap-2">
                                <FiCalendar className="w-5 h-5" />
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={reportConfig.startDate}
                                onChange={handleInputChange}
                                className="input-field text-lg"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="input-label text-lg flex items-center gap-2">
                                <FiCalendar className="w-5 h-5" />
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={reportConfig.endDate}
                                onChange={handleInputChange}
                                className="input-field text-lg"
                            />
                        </div>

                        {/* Department Filter */}
                        <div>
                            <label className="input-label text-lg flex items-center gap-2">
                                <FiFilter className="w-5 h-5" />
                                Department
                            </label>
                            <select
                                name="department"
                                value={reportConfig.department}
                                onChange={handleInputChange}
                                className="input-field text-lg appearance-none"
                            >
                                <option value="all">All Departments</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Sales">Sales</option>
                                <option value="Marketing">Marketing</option>
                                <option value="HR">Human Resources</option>
                                <option value="Finance">Finance</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>

                        {/* Report Type */}
                        <div>
                            <label className="input-label text-lg">Report Type</label>
                            <select
                                name="reportType"
                                value={reportConfig.reportType}
                                onChange={handleInputChange}
                                className="input-field text-lg appearance-none"
                            >
                                <option value="summary">Summary Report</option>
                                <option value="detailed">Detailed Report</option>
                                <option value="employee">Per Employee</option>
                                <option value="department">Per Department</option>
                            </select>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="mt-6">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            icon={FiFileText}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </div>
                </div>

                {/* Export Options */}
                {reportData && (
                    <div className="card animate-scale-in">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Export Report</h3>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary" icon={FiDownload} onClick={() => handleExport('csv')}>
                                Export as CSV
                            </Button>
                            <Button variant="secondary" icon={FiDownload} onClick={() => handleExport('pdf')}>
                                Export as PDF
                            </Button>
                            <Button variant="secondary" icon={FiDownload} onClick={() => handleExport('excel')}>
                                Export as Excel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Report Preview */}
                {reportData && (
                    <div className="card animate-scale-in">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Report Preview</h3>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                                <p className="text-base text-success-700 mb-1">Total Present</p>
                                <p className="text-4xl font-bold text-success-900">{reportData.summary?.totalPresent || 0}</p>
                            </div>
                            <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                                <p className="text-base text-warning-700 mb-1">Total Late</p>
                                <p className="text-4xl font-bold text-warning-900">{reportData.summary?.totalLate || 0}</p>
                            </div>
                            <div className="p-4 bg-danger-50 rounded-lg border border-danger-200">
                                <p className="text-base text-danger-700 mb-1">Total Absent</p>
                                <p className="text-4xl font-bold text-danger-900">{reportData.summary?.totalAbsent || 0}</p>
                            </div>
                            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                                <p className="text-base text-primary-700 mb-1">Attendance Rate</p>
                                <p className="text-4xl font-bold text-primary-900">
                                    {reportData.summary?.attendanceRate || 0}%
                                </p>
                            </div>
                        </div>

                        {/* Data Table */}
                        {reportData.data?.length > 0 && (
                            <div className="table-container">
                                <table className="w-full">
                                    <thead className="table-header">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">
                                                {reportConfig.reportType === 'department' ? 'Department' : 'Employee'}
                                            </th>
                                            <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">Present</th>
                                            <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">Late</th>
                                            <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">Absent</th>
                                            <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">Total Hours</th>
                                            <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.data.slice(0, 10).map((row, index) => (
                                            <tr key={index} className="table-row">
                                                <td className="px-6 py-4 font-medium text-lg text-gray-900">{row.name}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700">{row.present}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700">{row.late}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700">{row.absent}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700">{row.totalHours}h</td>
                                                <td className="px-6 py-4 text-lg font-semibold text-gray-900">{row.rate}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Reports */}
                <div className="card">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quick Reports</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                            <p className="text-xl font-semibold text-gray-900">This Week</p>
                            <p className="text-base text-gray-600 mt-1">Generate weekly summary report</p>
                        </button>
                        <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                            <p className="text-xl font-semibold text-gray-900">This Month</p>
                            <p className="text-base text-gray-600 mt-1">Generate monthly summary report</p>
                        </button>
                        <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                            <p className="text-xl font-semibold text-gray-900">Custom Range</p>
                            <p className="text-base text-gray-600 mt-1">Configure custom date range</p>
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ManagerReports;
