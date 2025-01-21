import mongoose from 'mongoose';
import './Contractor.js'; 
import './Project.js';
import './ProfileCompany.js'
import { type } from 'os';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    company_id:{
        type: String,
        required: [true, 'Please enter the CIF of company ']

    },
    company_addressligne1: {
        type: String,
        required: [true, 'Please enter the address ligne 1']
    },
    company_addressComplementaire: {
        type: String,
        default:"" 
    },
    company_zipcode: {
        type: String,
        required: [true, 'Please enter the zipcode']
    },
    company_city: {
        type: String,
        required: [true, 'Please enter the city']
    },
    company_country: {
        type: String,
        required: [true, 'Please enter the country']
    },
    disponibility: {
		type: String,
		enum: ['international', 'national', 'regional'],
		default: 'national'
	},
    profils: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profileCompany',
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],

}, { timestamps: true });

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;