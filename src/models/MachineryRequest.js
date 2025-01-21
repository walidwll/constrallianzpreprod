import mongoose from 'mongoose';

const machineryRequestSchema = new mongoose.Schema({
    machineryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machinery',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const MachineryRequest = mongoose.models.MachineryRequest || mongoose.model('MachineryRequest', machineryRequestSchema);
export default MachineryRequest;