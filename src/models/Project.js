import mongoose from 'mongoose';
import './Machinery.js';
import './Employee.js';
import './Company.js';


const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: [true, 'Please provide a project ID'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    employeesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    }],
    machineryId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machinery',
    }],
    budget: {
        type: Number,
        required: [true, 'Please provide a Budget'],
    },
    totalHours: {
        type: Number,
        default: 0,
    },
    totalCost: {
        type: Number,
        default: 0,
    },
    preTotalCost: {
        type: Number,
        default: 0,
    },
    costReport: [{
        month: {
            type: String,
        },
        cost: {
            type: Number,
        },
    }],
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completedHours: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;