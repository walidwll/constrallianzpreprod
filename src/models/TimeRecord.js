import mongoose from 'mongoose';

const timeRecordSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    supervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contractor',
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    checkInTime: {
        type: Date,
        required: true,
    },
    checkOutTime: {
        type: Date,
    },
    date: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const TimeRecord = mongoose.models.TimeRecord || mongoose.model('TimeRecord', timeRecordSchema);
export default TimeRecord;
