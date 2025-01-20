const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubContractorRequestSchema = new Schema({
	SubContractorId: {
		type: Schema.Types.ObjectId,
		ref: 'SubContractor',
		required: true
	},
	status: {
		type: String,
		default: 'pending',
		enum: ['pending', 'approved', 'rejected']
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const SubContractorRequest = mongoose.models.SubContractorRequest || mongoose.model('SubContractorRequest', SubContractorRequestSchema);
export default SubContractorRequest;
