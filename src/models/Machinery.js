import mongoose from 'mongoose';
import './SubContractor.js';
import './Contractor.js';
import './Project.js';



const machineryRatingSchema = new mongoose.Schema({
    performance: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
    },
    durability: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
    },
    costEfficiency: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
    },
    reliability: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
    },
    review: {
        type: String,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contractor',
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const MachinerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    subContractorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubContractor',
    },
    category: {
        type: String,
        required: [true, 'Please provide the category'],
    },
    model: {
        type: String,
        required: [true, 'Please provide the model'],
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        required: [true, 'Please provide the type'],
    },
    status: {
        type: Boolean,
        default: false
    },
    hourlyRate: {
        type: Number,
        required: [true, 'Please provide the hourly rate'],
    },
    rating: [machineryRatingSchema],
    costDetails: [{
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        totalHours: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: false
        },
        workHistory: [{
            hours: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }],
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    totalCost: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Machinery = mongoose.models.Machinery || mongoose.model('Machinery', MachinerySchema);
export default Machinery;