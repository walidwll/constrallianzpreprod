import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import './Company.js';

const contractorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    image: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        required: [true, 'Please provide a Phone'],
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
        enum: ['director', 'production', 'supervisor'],
        default: 'director',
    },
    didPassChanged: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

contractorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

contractorSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Contractor = mongoose.models.Contractor || mongoose.model('Contractor', contractorSchema);
export default Contractor;