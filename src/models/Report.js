import mongoose from 'mongoose';
import './SubCompany.js';
import './Project.js';
import './Employee.js';
import './Machinery.js';


const reportSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
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
    subCompanyReports: [{
        subCompanyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCompany'
        },
        subCompanyName: String,
        employeeDetails: [{
            employeeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            name: String,
            monthlyWorkedHours: Number,
            monthlyEarnings: Number,
            hourlyRate: Number,
            cost: Number
        }],
        machineryDetails: [{
            machineryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Machinery'
            },
            name: String,
            workedHours: Number,
            cost: Number
        }],
        totalLabourCost: Number,
        totalMachineryCost: Number,
        totalCost: Number,
        totalWorkedHours: Number,
        totalEmployees: Number,
        averageHourlyRate: Number
    }],
    totalLabourCost: {
        type: Number,
        required: true
    },
    totalMachineryCost: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    totalEmployees: {
        type: Number,
        required: true
    },
    monthlyStats: {
        totalWorkedHours: Number,
        averageHourlyRate: Number,
        peakWorkingDay: Date
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

reportSchema.index({ projectId: 1, month: 1, year: 1 }, { unique: true });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;