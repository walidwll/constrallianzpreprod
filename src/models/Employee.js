import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import './Contractor.js';
import './SubCompany.js';
import './Project.js';





export const ratingSchema = new mongoose.Schema({
  quality: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
  },
  technical: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
  },
  punctuality: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
  },
  safety: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
  },
  review: {
    type: String,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  image: {
    type: String,
    required: [true, 'Please provide Image'],
  },
  role: {
    type: String,
    default: 'Employee',
  },
  phone: {
    type: String,
    required: [true, 'Please provide a Phone'],
  },
  subCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCompany',
  },
  cv: {
    type: String,
    required: [true, 'Please provide a CV'],
  },
  workedHour: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: String,
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
  rating: [ratingSchema],
  projectDetails: [{
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    hourlyRate: Number,
    isActive: {
      type: Boolean,
      default: false
    }
  }],
  workedHoursDetails: [{
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    workedHours: Number,
    hourlyRate: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
}, { timestamps: true });

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default Employee;