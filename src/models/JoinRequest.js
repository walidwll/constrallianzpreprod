// mongo model for request that contain company all data
import mongoose from 'mongoose';

/*
const contractorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
});
*/
const profilecompanySchema = new mongoose.Schema({
    first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	identity_number:{ type: String, required: true },
	identity_type: {type: String, enum: ['DNI', 'NIE', 'Other'],required: true},
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    password: { type: String, required: true },
	position:{type: String, required: true},
	profile_addressligne1: { type: String, required: true },
	profile_addressComplementaire: String ,
	profile_zipcode: { type: String, required: true },
	profile_city: { type: String, required: true },
	profile_country: { type: String, required: true },
});
/*const joinRequestSchema = new mongoose.Schema({
	companyName: String,
	director: contractorSchema,
	production: contractorSchema,
	supervisor: contractorSchema,
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected'],
		default: 'pending',
	},
}, { timestamps: true });
*/
const joinRequestSchema = new mongoose.Schema({
	companyName: { type: String, required: true },
	companyCIF: { type: String, required: true },
	company_addressligne1: { type: String , required: true },
	company_addressComplementaire: String ,
	company_zipcode: { type: String, required: true },
	company_city: { type: String, required: true },
	company_country: { type: String, required: true },
	disponibility: {type: String,enum: ['international', 'national', 'regional'],default: 'national'},
	director: profilecompanySchema,
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected'],
		default: 'pending',
	},
}, { timestamps: true });

export default mongoose.models.JoinRequest || mongoose.model('JoinRequest', joinRequestSchema);
