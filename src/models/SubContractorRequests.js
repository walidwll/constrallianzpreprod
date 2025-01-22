const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubContractorRequestSchema = new Schema({
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
