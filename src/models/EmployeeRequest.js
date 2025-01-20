const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeRequestSchema = new Schema({
    ProjectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    EmployeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
});

const EmployeeRequest = mongoose.models.EmployeeRequest || mongoose.model('EmployeeRequest', EmployeeRequestSchema);
export default EmployeeRequest;
