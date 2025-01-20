import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import './Company.js';

const profileCompanySchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please provide the first name'],
    },
    last_name: {
        type: String,
        required: [true, 'Please provide the last name'],
    },
    position: {
        type: String,
        required: [true, 'Please provide your company position']
    },
    identity_type: {
        type: String,
        enum: ['DNI', 'NIE', 'Other'],
        required: true
    },
    identity_number: {
        type: String,
        required: true,
        uppercase:true,
        validate: {
          validator: function (v) {
            if (this.identity_type === 'DNI') {
              return /^[0-9]{8}[A-Za-z]$/.test(v); // DNI format
            }
            if (this.identity_type === 'NIE') {
              return /^[XYZ][0-9]{7}[A-Za-z]$/.test(v); // NIE format
            }
            if (this.identity_type === 'Other') {
              return v.length > 0; // Any non-empty value for "Other"
            }
            return false; // Fallback if none match
          },
          message: props => "Invalid ${props.value} for the selected identity type"
        }
    },
    image: {
        type: String,
        default: '',
    },
    phone_number: {
        type: String,
        required: [true, 'Please provide a Phone'],
        match: [/^\+\d{9,13}$/, 'Please provide a valid phone number'],       
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password should be at least 6 characters'],
    },
    role: {
        type: String,
        enum: ['director', 'manager', 'production', 'supervisor'],
        default: 'director',
    },
    isRP: {
        type: Boolean,
        default: false
    },
    addProject: {
        type: Boolean,
        default: false
    },
    didPassChanged: {
        type: Boolean,
        default: false
    },
    profile_addressligne1: {
        type: String,
        required: [true, 'Please enter the address ligne 1']
    },
    profile_addressComplementaire: {
        type: String,
        default:"" 
    },
    profile_zipcode: {
        type: String,
        required: [true, 'Please enter the zipcode']
    },
    profile_city: {
        type: String,
        required: [true, 'Please enter the city']
    },
    profile_country: {
        type: String,
        required: [true, 'Please enter the country']
    },
}, { timestamps: true });

profileCompanySchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

profileCompanySchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const profileCompany = mongoose.models.profileCompany || mongoose.model('profileCompany', profileCompanySchema);
export default profileCompany;