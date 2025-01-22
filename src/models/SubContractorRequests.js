const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubContractorRequestSchema = new Schema({
	first_name: {
		type: String,
		required: false
	},
	last_name: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: false
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
