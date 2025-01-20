import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({

    subContractorId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubContractor',
    }],
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    status: {
        type: String,
        required: [true, 'Please provide a status'],
        enum: ['pending', 'approved', 'rejected'],
    },
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;