const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubContractorRequestSchema = new Schema({
	first_name: {
		type: String,
		required: true,
	  },
	  last_name: {
		type: String,
		required: true,
	  },
	  email: {
		type: String,
		required: true,
		match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
	  },
	  role: {
		type: String,
		required: true,
		enum: ['SubManager', 'SubAdministrator']
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
