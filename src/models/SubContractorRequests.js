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
	role: {
		type: String,
		enum: ['SubManager', 'SubAdministrator'],
		required: true,
	},
	invitedBy: {
		  type: mongoose.Schema.Types.ObjectId,
		  ref: 'SubContractor', 
		  required: true,
	},
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SubCompany', 
		required: true,
  },
	isRP: {
		type: Boolean,
		default: false, 
	},
	status: {
		type: String,
		default: 'pending',
		enum: ['pending', 'approved', 'rejected']
	}
 },{
    timestamps: true,
}
);

const SubContractorRequest = mongoose.models.SubContractorRequest || mongoose.model('SubContractorRequest', SubContractorRequestSchema);
export default SubContractorRequest;
