const mongoose = require('mongoose');

const inviteRequestSchema = new mongoose.Schema(
  {
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
      enum: ['director', 'manager', 'production', 'supervisor']
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profileCompany', 
      required: true,
    },
    isRP: {
      type: Boolean,
      default: false, 
    },
    addProject: {
      type: Boolean,
      default: false,
    },
    status: {
		type: String,
		enum: ['pending', 'accepted', 'rejected'],
		default: 'pending',
	},
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.InviteRequest || mongoose.model('InviteRequest', inviteRequestSchema);

