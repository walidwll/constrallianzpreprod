import mongoose from 'mongoose';
import "./SubCompany.js"
import bcrypt from 'bcryptjs';

const SubContractorSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please provide your first name'],
    },
    last_name: {
        type: String,
        required: [true, 'Please provide your last name'],
    },
    image: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['SubManager', 'SubAdministrator'],
        default: 'SubManager',
    },
    phone: {
        type: String,
        required: [true, 'Please provide a Phone number'],
        match: [/^\+\d{9,13}$/, 'Please provide a valid phone number'],
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCompany',
        required: true,
    },
    companyPosition: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password should be at least 6 characters'],
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    identity: {
        type: {
          type: String,
          enum: ['DNI', 'NIE', 'Other'], 
          required: true
        },
        number: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              if (this.identity.type === 'DNI') {
                return /^[0-9]{8}[A-Za-z]$/.test(v); // DNI format
              }
              if (this.identity.type === 'NIE') {
                return /^[XYZ][0-9]{7}[A-Za-z]$/.test(v); // NIE format
              }
              if (this.identity.type === 'Other') {
                return v.length > 0; // Any non-empty value for "Other"
              }
              return false; // Fallback if none match
            },
            message: props => `Invalid ${props.value} for the selected identity type`
          }
        }
      },
      address: {
        addressligne1: { type: String, required: [true, 'Please enter the address ligne 1'] },
        addressComplementaire: { type: String,  default:""  },
        city: { type: String, required: [true, 'Please enter the city'] },
        postalCode: { type: String, required: [true, 'Please enter the postal Code'] },
        country: { type: String, required: [true, 'Please enter the country'] },
      },
      isRP: {
        type: Boolean,
        default: false,
      },
}, { timestamps: true });

SubContractorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

SubContractorSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const SubContractor = mongoose.models.SubContractor || mongoose.model('SubContractor', SubContractorSchema);

export default SubContractor;