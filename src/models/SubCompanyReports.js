
import mongoose from 'mongoose';
import './SubCompany.js';
import './Employee.js';
import './Machinery.js';

const subCompanyReportSchema = new mongoose.Schema({
    subCompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCompany',
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    employeeStats: [{
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        name: String,
        totalProjects: Number,
        totalWorkedHours: Number,
        totalEarnings: Number,
        averageRating: Number
    }],
    machineryStats: [{
        machineryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Machinery'
        },
        name: String,
        totalProjects: Number,
        totalWorkedHours: Number,
        totalEarnings: Number,
        averageRating: Number
    }],
    totalStats: {
        totalEmployees: Number,
        totalMachinery: Number,
        totalProjects: Number,
        totalRevenue: Number,
        averageEmployeeRating: Number,
        averageMachineryRating: Number
    }
}, { timestamps: true });

subCompanyReportSchema.index({ subCompanyId: 1, month: 1, year: 1 }, { unique: true });

const SubCompanyReport = mongoose.models.SubCompanyReport || mongoose.model('SubCompanyReport', subCompanyReportSchema);
export default SubCompanyReport;